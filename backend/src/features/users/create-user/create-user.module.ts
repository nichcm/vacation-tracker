import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { CreateUserController } from './create-user.controller.js';
import { CreateUserHandler } from './create-user.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CreateUserController],
  providers: [CreateUserHandler],
})
export class CreateUserModule {}
