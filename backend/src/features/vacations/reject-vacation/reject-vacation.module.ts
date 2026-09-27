import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { RejectVacationController } from './reject-vacation.controller.js';
import { RejectVacationHandler } from './reject-vacation.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [RejectVacationController],
  providers: [RejectVacationHandler],
})
export class RejectVacationModule {}
