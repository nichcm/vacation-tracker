import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { ListMonthlyController } from './list-monthly.controller.js';
import { ListMonthlyHandler } from './list-monthly.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [ListMonthlyController],
  providers: [ListMonthlyHandler],
})
export class ListMonthlyModule {}
