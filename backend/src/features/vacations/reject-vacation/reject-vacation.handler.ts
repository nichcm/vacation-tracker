import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { Clock } from '../../../shared/clock/clock.js';
import {
  VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { toVacationView, type VacationView } from '../shared/vacation-view.js';
import type { RejectVacationRequest } from './reject-vacation.dto.js';

@Injectable()
export class RejectVacationHandler {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacations: Repository<VacationRequest>,
    private readonly clock: Clock,
  ) {}

  async execute(
    manager: AuthenticatedUser,
    vacationId: string,
    { reason }: RejectVacationRequest,
  ): Promise<VacationView> {
    const vacation = await this.vacations.findOne({
      where: { id: vacationId },
      relations: { user: true },
    });
    if (!vacation) throw new NotFoundException('Solicitação não encontrada');
    if (vacation.userId === manager.id) {
      throw new ForbiddenException(
        'Você não pode decidir a sua própria solicitação',
      );
    }
    if (vacation.status !== VacationStatus.PENDING) {
      throw new ConflictException('Esta solicitação já foi decidida');
    }

    vacation.status = VacationStatus.REJECTED;
    vacation.decidedById = manager.id;
    vacation.decidedAt = this.clock.now();
    vacation.rejectionReason = reason?.trim() || null;

    return toVacationView(await this.vacations.save(vacation));
  }
}
