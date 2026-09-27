import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity.js';
import { GetMeController } from './get-me.controller.js';
import { GetMeHandler } from './get-me.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GetMeController],
  providers: [GetMeHandler],
})
export class GetMeModule {}
