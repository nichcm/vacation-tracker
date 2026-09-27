import {
  createParamDecorator,
  type ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { UserRole } from '../entities/user.entity.js';
import type { AuthenticatedUser } from './authenticated-user.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/** Libera a rota do guard JWT global. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Restringe a rota aos papéis informados. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/** Injeta o usuário autenticado (extraído do JWT). */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser =>
    ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>().user,
);
