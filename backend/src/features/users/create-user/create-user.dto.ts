import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../shared/entities/user.entity.js';

export class CreateUserRequest {
  @ApiProperty({ example: 'Rafael Costa' })
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome' })
  @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres' })
  name: string;

  @ApiProperty({ example: 'rafael@empresa.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(180, { message: 'O e-mail deve ter no máximo 180 caracteres' })
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  // Limite do bcrypt: bytes além de 72 são ignorados
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres' })
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, {
    message: 'Papel inválido (use EMPLOYEE, MANAGER ou ADMIN)',
  })
  role: UserRole;
}
