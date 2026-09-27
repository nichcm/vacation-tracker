import { ApiProperty } from '@nestjs/swagger';
import { type User, UserRole } from '../../../shared/entities/user.entity.js';

/** Formato de resposta compartilhado pelas slices de usuários (nunca expõe o hash da senha). */
export class UserView {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
  @ApiProperty() createdAt: Date;
}

export function toUserView(user: User): UserView {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
