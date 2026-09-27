import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { toVacationView, type VacationView } from '../shared/vacation-view.js';

@Injectable()
export class ListPendingHandler {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacations: Repository<VacationRequest>,
  ) {}

  /** Pendentes de outros colaboradores (o gestor não decide as próprias). */
  async execute(managerId: string): Promise<VacationView[]> {
    const vacations = await this.vacations.find({
      where: { status: VacationStatus.PENDING, userId: Not(managerId) },
      relations: { user: true },
      order: { startDate: 'ASC' },
    });
    return vacations.map(toVacationView);
  }
}
