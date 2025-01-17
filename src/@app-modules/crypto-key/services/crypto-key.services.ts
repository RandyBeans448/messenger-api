import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CryptoKeys } from '../entities/crypto-key.entity';
import * as crypto from 'crypto';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';

@Injectable()
export class CryptoKeyService {

    // private _logger = new Logger(CryptoKeyService.name);

    // constructor(
    //     @InjectRepository(CryptoKeys)
    //     private _cryptoKeyRepository: Repository<CryptoKeys>,
    // ) { }

    // public async findAll(): Promise<CryptoKeys[]> {
    //     try {
    //         return await this._cryptoKeyRepository.find();
    //     } catch (error) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // public async findOne(id: number): Promise<CryptoKeys> {
    //     try {
    //         const cryptoKey: CryptoKeys = await this._cryptoKeyRepository.findOneBy({ id });
    //         if (!cryptoKey) {
    //             throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
    //         }
    //         return cryptoKey;
    //     } catch (error) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // public async createNewCryptoKey(cryptoKey: CryptoKeys): Promise<CryptoKeys> {
    //     try {
    //         return await this._cryptoKeyRepository.save(cryptoKey);
    //     } catch (error) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // public async remove(id: number): Promise<DeleteResult> {
    //     try {
    //         const result: DeleteResult = await this._cryptoKeyRepository.delete(id);

    //         if (result.affected === 0) {
    //             throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
    //         }

    //         return result;
    //     } catch (error) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // public async createCryptoKeys(conversation: Conversation): Promise<CryptoKeys[]> {

    //     const cryptoKeyUserOne: CryptoKeys = new CryptoKeys();
    //     const cryptoKeyUserTwo: CryptoKeys = new CryptoKeys();

    //     const ecdhUserOne = crypto.createECDH('prime256v1');
    //     const ecdhUserOneKey = ecdhUserOne.generateKeys();

    //     const ecdhUserTwo = crypto.createECDH('prime256v1');
    //     const ecdhUserTwoKey = ecdhUserTwo.generateKeys();

    //     const userOneSecret: Buffer = ecdhUserOne.computeSecret(ecdhUserTwoKey);
    //     const userTwoSecret: Buffer = ecdhUserTwo.computeSecret(ecdhUserOneKey);

    //     if (!userOneSecret.equals(userTwoSecret)) {
    //         throw new Error('Shared secrets do not match!');
    //     }

    //     cryptoKeyUserOne.sharedSecret = userOneSecret.toString('hex'); // convert back to buffer
    //     cryptoKeyUserTwo.sharedSecret = userTwoSecret.toString('hex'); // convert back to buffer

    //     try {

    //         // return await Promise.all([
    //             const one = await this.createNewCryptoKey(cryptoKeyUserOne);
    //             const two = await this.createNewCryptoKey(cryptoKeyUserTwo);
    //         // ]);
    //         return [one, two];
    //     } catch (error) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
}
