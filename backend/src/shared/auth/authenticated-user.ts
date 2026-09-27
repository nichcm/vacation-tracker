import type { UserRole } from '../entities/user.entity.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}
