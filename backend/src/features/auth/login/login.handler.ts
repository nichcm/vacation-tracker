import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import type { JwtPayload } from '../../../shared/auth/authenticated-user.js';
import { User } from '../../../shared/entities/user.entity.js';
import type { LoginRequest, LoginResponse } from './login.dto.js';

@Injectable()
export class LoginHandler {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email: request.email })
      .getOne();

    if (!user || !(await compare(request.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
