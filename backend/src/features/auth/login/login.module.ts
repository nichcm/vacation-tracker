import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { LoginController } from './login.controller.js';
import { LoginHandler } from './login.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [LoginController],
  providers: [LoginHandler],
})
export class LoginModule {}
