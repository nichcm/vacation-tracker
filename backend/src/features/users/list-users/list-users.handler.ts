import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { toUserView, type UserView } from '../shared/user-view.js';

@Injectable()
export class ListUsersHandler {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async execute(): Promise<UserView[]> {
    const users = await this.users.find({ order: { name: 'ASC' } });
    return users.map(toUserView);
  }
}
