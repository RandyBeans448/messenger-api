import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class InternalCallGuard implements CanActivate {
  private _logger = new Logger(InternalCallGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const isInternal: boolean = request.ip.indexOf('127.0.0.1') > -1;

    if (!isInternal) {
      this._logger.warn(
        `IP ${request.ip} was trying to access internal endpoint ${request.path}`,
      );
    }

    return isInternal;
  }
}
