import {
    Controller,
    Get,
    Delete,
    Param,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { CryptoKeyService } from '../services/crypto-key.services';
import { CryptoKeys } from '../entities/crypto-key.entity';

@Controller('crypto-keys')
export class CryptoKeyController {
    private _logger = new Logger(CryptoKeyController.name);
    constructor(private readonly cryptoKeyService: CryptoKeyService) { }

    @Get()
    async findAll(): Promise<CryptoKeys[]> {
        try {
            return await this.cryptoKeyService.findAll();
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
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
            this._logger.error(error);
            throw new HttpException(
                error,
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
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
