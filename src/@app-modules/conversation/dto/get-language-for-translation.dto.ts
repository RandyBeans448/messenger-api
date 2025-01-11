import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetLanguageForTranslationDTO {

    @IsNotEmpty()
    @ApiProperty()
    searchQuery: string;
}
