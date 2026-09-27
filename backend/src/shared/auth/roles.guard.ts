import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../entities/user.entity.js';
import type { AuthenticatedUser } from './authenticated-user.js';
import { ROLES_KEY } from './decorators.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles?.length) return true;

    const user = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>().user;
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Acesso restrito a gestores');
    }
    return true;
  }
}
