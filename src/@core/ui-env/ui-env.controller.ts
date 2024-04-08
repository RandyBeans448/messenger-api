// ui-env.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UiEnvService } from './ui-env.service';
import { UiEnvNamespace } from './interfaces/ui-env.namespace';

@Controller('ui-env')
export class UiEnvController {
  constructor(private readonly _uiEnvService: UiEnvService) {}

  @Get(':project_name')
  getUiEnv(
    @Param('project_name') projectName: UiEnvNamespace.ProjectNames,
  ): Record<string, any> {
    console.log(projectName);
    return this._uiEnvService.getEnv(projectName);
  }
}
