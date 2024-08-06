// ui-env.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UiEnvController } from './ui-env.controller';
import { UiEnvService } from './ui-env.service';

@Module({
    controllers: [UiEnvController],
    providers: [UiEnvService, ConfigService],
})
export class UiEnvModule { }
