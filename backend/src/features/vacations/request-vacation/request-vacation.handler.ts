import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { Clock } from '../../../shared/clock/clock.js';
import { isValidDateOnly } from '../../../shared/dates/date-only.js';
import {
  VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { toVacationView, type VacationView } from '../shared/vacation-view.js';
import type { RequestVacationRequest } from './request-vacation.dto.js';

@Injectable()
export class RequestVacationHandler {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacations: Repository<VacationRequest>,
    private readonly clock: Clock,
  ) {}

  async execute(
    user: AuthenticatedUser,
    { startDate, endDate }: RequestVacationRequest,
  ): Promise<VacationView> {
    if (!isValidDateOnly(startDate) || !isValidDateOnly(endDate)) {
      throw new BadRequestException('Data inválida');
    }
    if (endDate < startDate) {
      throw new BadRequestException(
        'A data de fim deve ser igual ou posterior à data de início',
      );
    }
    if (startDate < this.clock.today()) {
      throw new BadRequestException(
        'A data de início não pode estar no passado',
      );
    }

    const overlaps = await this.vacations.exists({
      where: {
        userId: user.id,
        status: In([VacationStatus.PENDING, VacationStatus.APPROVED]),
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
      },
    });
    if (overlaps) {
      throw new ConflictException(
        'Já existe uma solicitação pendente ou aprovada nesse período',
      );
    }

    const saved = await this.vacations.save(
      this.vacations.create({
        userId: user.id,
        startDate,
        endDate,
        status: VacationStatus.PENDING,
      }),
    );
    return toVacationView(saved);
  }
}
