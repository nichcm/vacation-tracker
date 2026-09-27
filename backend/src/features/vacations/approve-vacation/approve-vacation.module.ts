import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { ApproveVacationController } from './approve-vacation.controller.js';
import { ApproveVacationHandler } from './approve-vacation.handler.js';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  controllers: [ApproveVacationController],
  providers: [ApproveVacationHandler],
})
export class ApproveVacationModule {}
