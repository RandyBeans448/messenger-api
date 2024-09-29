import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CryptoKeys } from '../entities/crypto-key.entity';
import * as crypto from 'crypto';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';
import { FriendService } from 'src/@app-modules/friend/services/friend.service';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

@Injectable()
export class CryptoKeyService {
    constructor(
        @InjectRepository(CryptoKeys)
        private cryptoKeyRepository: Repository<CryptoKeys>,
    ) { }

    public async findAll(): Promise<CryptoKeys[]> {
        try {
            return await this.cryptoKeyRepository.find();
        } catch (error) {
            throw new HttpException('Failed to fetch crypto keys', HttpStatus.INTERNAL_SERVER_ERROR);
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
            if (error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new HttpException('Failed to fetch the crypto key', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async createNewCryptoKey(cryptoKey: CryptoKeys): Promise<CryptoKeys> {
        try {
            return await this.cryptoKeyRepository.save(cryptoKey);
        } catch (error) {
            throw new HttpException('Failed to create crypto key', HttpStatus.INTERNAL_SERVER_ERROR);
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

            if (error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }

            throw new HttpException('Failed to delete the crypto key', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async createCryptoKeys(conversation: Conversation){
        console.log('creating keys')
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
            throw new HttpException('Failed to create crypto keys', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
