import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { ListMyVacationsController } from './list-my-vacations.controller.js';
import { ListMyVacationsHandler } from './list-my-vacations.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [ListMyVacationsController],
  providers: [ListMyVacationsHandler],
})
export class ListMyVacationsModule {}
