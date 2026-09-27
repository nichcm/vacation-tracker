import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { toUserView, type UserView } from '../shared/user-view.js';
import type { CreateUserRequest } from './create-user.dto.js';

const UNIQUE_VIOLATION = '23505';
const EMAIL_TAKEN = 'Já existe um usuário com este e-mail';

@Injectable()
export class CreateUserHandler {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async execute(request: CreateUserRequest): Promise<UserView> {
    const name = request.name.trim();
    const email = request.email.trim().toLowerCase();
    if (!name) throw new BadRequestException('Informe o nome');

    if (await this.users.exists({ where: { email } })) {
      throw new ConflictException(EMAIL_TAKEN);
    }

    try {
      const user = await this.users.save(
        this.users.create({
          name,
          email,
          role: request.role,
          passwordHash: await hash(request.password, 10),
        }),
      );
      return toUserView(user);
    } catch (error) {
      // Corrida entre dois cadastros com o mesmo e-mail
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === UNIQUE_VIOLATION
      ) {
        throw new ConflictException(EMAIL_TAKEN);
      }
      throw error;
    }
  }
}
