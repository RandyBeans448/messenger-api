// ui-env.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UiEnvNamespace } from './interfaces/ui-env.namespace';

@Injectable()
export class UiEnvService {
  private _mainUiEnv: UiEnvNamespace.MainUi;

  constructor(private _configService: ConfigService) {}

  public getEnv(projectName: UiEnvNamespace.ProjectNames): Record<string, any> {
    switch (projectName) {
      case 'main_ui': {
        this._mainUiEnv = {
          production: this._configService.get('ENV') === 'production',
          name: this._configService.get('ENV'),
          baseApi: this._configService.get('MAIN_UI_BASE_URL'),
          auth0: {
            clientId: this._configService.get('MAIN_UI_AUTH0_CLIENT_ID'),
            domain: this._configService.get('MAIN_UI_AUTH0_CLIENT_DOMAIN'),
          },
        };

        return this._mainUiEnv;
      }
    }
  }
}
