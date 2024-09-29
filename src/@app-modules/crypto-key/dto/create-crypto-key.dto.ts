import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCryptoKeyDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    settingValue: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    settingName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string;
}