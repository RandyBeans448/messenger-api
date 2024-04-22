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
    console.log(projectName, 'geezer town');
    const thing = this._uiEnvService.getEnv(projectName);
    console.log(thing, 'geezer town');
    return thing;
  }
}
