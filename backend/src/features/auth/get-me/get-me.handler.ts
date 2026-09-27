import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity.js';

@Injectable()
export class GetMeHandler {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async execute(userId: string) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
