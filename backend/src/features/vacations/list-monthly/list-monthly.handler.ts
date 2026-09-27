import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { monthRange } from '../../../shared/dates/date-only.js';
import {
  VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { toVacationView } from '../shared/vacation-view.js';
import type { ListMonthlyResponse } from './list-monthly.dto.js';

@Injectable()
export class ListMonthlyHandler {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacations: Repository<VacationRequest>,
  ) {}

  /** Férias aprovadas que tocam qualquer dia do mês informado. */
  async execute(month: string): Promise<ListMonthlyResponse> {
    const { first, last } = monthRange(month);
    const vacations = await this.vacations.find({
      where: {
        status: VacationStatus.APPROVED,
        startDate: LessThanOrEqual(last),
        endDate: MoreThanOrEqual(first),
      },
      relations: { user: true },
      order: { startDate: 'ASC' },
    });
    return { month, items: vacations.map(toVacationView) };
  }
}
