import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { ListUsersController } from './list-users.controller.js';
import { ListUsersHandler } from './list-users.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ListUsersController],
  providers: [ListUsersHandler],
})
export class ListUsersModule {}
