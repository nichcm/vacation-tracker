import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { ListPendingController } from './list-pending.controller.js';
import { ListPendingHandler } from './list-pending.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [ListPendingController],
  providers: [ListPendingHandler],
})
export class ListPendingModule {}
