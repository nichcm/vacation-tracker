import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from '../../../shared/entities/vacation-request.entity.js';
import { toVacationView, type VacationView } from '../shared/vacation-view.js';

@Injectable()
export class ListMyVacationsHandler {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacations: Repository<VacationRequest>,
  ) {}

  async execute(userId: string): Promise<VacationView[]> {
    const vacations = await this.vacations.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
    return vacations.map(toVacationView);
  }
}
