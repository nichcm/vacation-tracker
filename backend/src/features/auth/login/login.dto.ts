import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../../shared/entities/user.entity.js';

export class LoginRequest {
  @ApiProperty({ example: 'gestor@empresa.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @ApiProperty({ example: 'ferias123' })
  @IsString()
  @IsNotEmpty({ message: 'Informe a senha' })
  password: string;
}

export class LoggedUser {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
}

export class LoginResponse {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: LoggedUser }) user: LoggedUser;
}
