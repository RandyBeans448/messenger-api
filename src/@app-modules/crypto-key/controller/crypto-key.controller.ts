import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CryptoKeyService } from '../services/crypto-key.services';
import { CryptoKeys } from '../entities/crypto-key.entity';

@Controller('crypto-keys')
export class CryptoKeyController {
    constructor(private readonly cryptoKeyService: CryptoKeyService) { }

    @Get()
    async findAll(): Promise<CryptoKeys[]> {
        try {
            return await this.cryptoKeyService.findAll();
        } catch (error) {
            throw new HttpException(
                'Failed to fetch crypto keys',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<CryptoKeys> {
        try {
            const cryptoKey = await this.cryptoKeyService.findOne(id);
            if (!cryptoKey) {
                throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
            }
            return cryptoKey;
        } catch (error) {
            if (error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new HttpException(
                'Failed to fetch the crypto key',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post()
    async create(@Body() cryptoKey: CryptoKeys) {
        try {
            // return await this.cryptoKeyService.createCryptoKeys(cryptoKey);
        } catch (error) {
            throw new HttpException(
                'Failed to create crypto key',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        try {
            const result = await this.cryptoKeyService.remove(id);
            if (!result) {
                throw new HttpException('Crypto key not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new HttpException(
                'Failed to delete the crypto key',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
