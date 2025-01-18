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
    //     try {
    //         const cryptoKeyUserOne: CryptoKeys = new CryptoKeys();
    //         const cryptoKeyUserTwo: CryptoKeys = new CryptoKeys();
    
    //         const ecdhUserOne: crypto.ECDH = crypto.createECDH('prime256v1');
    //         const ecdhUserOneKey: Buffer = ecdhUserOne.generateKeys();
    
    //         const ecdhUserTwo: crypto.ECDH = crypto.createECDH('prime256v1');
    //         const ecdhUserTwoKey: Buffer = ecdhUserTwo.generateKeys();
    
    //         const userOneSecret: Buffer = ecdhUserOne.computeSecret(ecdhUserTwoKey);
    //         const userTwoSecret: Buffer = ecdhUserTwo.computeSecret(ecdhUserOneKey);
    
    //         if (!userOneSecret.equals(userTwoSecret)) {
    //             this._logger.error('Shared secrets do not match for conversation ID:', conversation.id);
    //             throw new HttpException(
    //                 'Failed to create crypto keys due to mismatched shared secrets.',
    //                 HttpStatus.INTERNAL_SERVER_ERROR,
    //             );
    //         }
    
    //         cryptoKeyUserOne.sharedSecret = userOneSecret.toString('hex');
    //         cryptoKeyUserTwo.sharedSecret = userTwoSecret.toString('hex');
    
    //         // Save both keys atomically
    //         const [keyOne, keyTwo] = await Promise.all([
    //             this.createNewCryptoKey(cryptoKeyUserOne),
    //             this.createNewCryptoKey(cryptoKeyUserTwo),
    //         ]);
    
    //         return [keyOne, keyTwo];
    //     } catch (error) {
    //         this._logger.error(`Error creating crypto keys: ${error.message}`, error.stack);
    //         throw new HttpException(
    //             'An error occurred while creating crypto keys.',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
    
}
