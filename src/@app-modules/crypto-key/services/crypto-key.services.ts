import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CryptoKeys } from '../entities/crypto-key.entity';
import * as crypto from 'crypto';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';

@Injectable()
export class CryptoKeyService {

    private _logger = new Logger(CryptoKeyService.name);

    constructor(
        @InjectRepository(CryptoKeys)
        private cryptoKeyRepository: Repository<CryptoKeys>,
    ) { }

    public async findAll(): Promise<CryptoKeys[]> {
        try {
            return await this.cryptoKeyRepository.find();
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async findOne(id: number): Promise<CryptoKeys> {
        try {
            const cryptoKey: CryptoKeys = await this.cryptoKeyRepository.findOneBy({ id });
            if (!cryptoKey) {
                throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
            }
            return cryptoKey;
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async createNewCryptoKey(cryptoKey: CryptoKeys): Promise<CryptoKeys> {
        try {
            return await this.cryptoKeyRepository.save(cryptoKey);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async remove(id: number): Promise<DeleteResult> {
        try {
            const result: DeleteResult = await this.cryptoKeyRepository.delete(id);

            if (result.affected === 0) {
                throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
            }

            return result;
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async createCryptoKeys(conversation: Conversation){
        const cryptoKeyUserOne: CryptoKeys = new CryptoKeys();
        cryptoKeyUserOne.friend = conversation.friend[0];

        const cryptoKeyUserTwo: CryptoKeys = new CryptoKeys();
        cryptoKeyUserTwo.friend = conversation.friend[1];

        const userOne: crypto.DiffieHellman = crypto.createDiffieHellman(2048);
        const userOneKey: Buffer = userOne.generateKeys();

        const userTwo: crypto.DiffieHellman = crypto.createDiffieHellman(userOne.getPrime(), userOne.getGenerator());
        const userTwoKey: Buffer = userTwo.generateKeys();

        const userOneSecret: Buffer = userOne.computeSecret(userTwoKey);
        const userTwoSecret: Buffer = userTwo.computeSecret(userOneKey);

        if (!userOneSecret.equals(userTwoSecret)) {
            throw new Error('Shared secrets do not match!');
        }

        cryptoKeyUserOne.sharedSecret = userOneSecret.toString('hex'); // convert back to buffer
        cryptoKeyUserTwo.sharedSecret = userTwoSecret.toString('hex'); // convert back to buffer

        try {

            return await Promise.all([
                await this.createNewCryptoKey(cryptoKeyUserOne),
                await this.createNewCryptoKey(cryptoKeyUserTwo),
            ]);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
