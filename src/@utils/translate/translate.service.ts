import { Injectable, Logger } from '@nestjs/common';
import { LanguageResult, Translate } from '@google-cloud/translate/build/src/v2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TranslateService {
    // private _logger: Logger = new Logger(TranslateService.name);
    // private translateClient: Translate;


    // constructor(private _configService: ConfigService) {
    //     this.translateClient = new Translate({
    //         key: this._configService.get('GOOGLE_TRANSLATION_API_KEY'),
    //     });
    // }

    // public async translateText(text: string, targetLanguage: string): Promise<string> {
    //     try {
    //         const [translation] = await this.translateClient.translate(text, targetLanguage);
    //         return translation;
    //     } catch (error) {
    //         this._logger.error(error.message)
    //         throw new Error(`Translation failed: ${error.message}`);
    //     }
    // }

    // public async getSupportedLanguages(searchQuery: string): Promise<LanguageResult[]> {
    //     try {
    //         const [languages] = await this.translateClient.getLanguages();
    //         return languages.filter(language => language.name.toLowerCase().includes(searchQuery.toLowerCase()));
    //     } catch (error) {
    //         this._logger.error(error.message)
    //         throw new Error(`Failed to get supported languages: ${error.message}`);
    //     }
    // }
}

