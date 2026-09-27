import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { RequestVacationController } from './request-vacation.controller.js';
import { RequestVacationHandler } from './request-vacation.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [RequestVacationController],
  providers: [RequestVacationHandler],
})
export class RequestVacationModule {}
