import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { ConfigService } from '@nestjs/config';


@Module({
    providers: [TranslateService, ConfigService],
    exports: [TranslateService],
})
export class TranslateModule { }