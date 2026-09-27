import { ConflictException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import type { Clock } from '../../../shared/clock/clock.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import {
  type VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { RejectVacationHandler } from './reject-vacation.handler.js';

const manager: AuthenticatedUser = {
  id: 'manager-1',
  email: 'gestor@empresa.com',
  name: 'Gestora',
  role: UserRole.MANAGER,
};

describe('RejectVacationHandler', () => {
  let repo: {
    findOne: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let handler: RejectVacationHandler;

  beforeEach(() => {
    repo = {
      findOne: vi.fn().mockResolvedValue({
        id: 'v-1',
        userId: 'user-1',
        startDate: '2026-10-05',
        endDate: '2026-10-09',
        status: VacationStatus.PENDING,
        createdAt: new Date(),
      }),
      save: vi.fn((v: VacationRequest) => Promise.resolve(v)),
    };
    handler = new RejectVacationHandler(
      repo as unknown as Repository<VacationRequest>,
      { now: () => new Date() } as Clock,
    );
  });

  it('recusa com motivo', async () => {
    const result = await handler.execute(manager, 'v-1', {
      reason: '  Fechamento do trimestre ',
    });
    expect(result.status).toBe(VacationStatus.REJECTED);
    expect(result.rejectionReason).toBe('Fechamento do trimestre');
  });

  it('recusa sem motivo', async () => {
    const result = await handler.execute(manager, 'v-1', {});
    expect(result.rejectionReason).toBeNull();
  });

  it('não permite recusar solicitação já aprovada', async () => {
    repo.findOne.mockResolvedValue({
      id: 'v-1',
      userId: 'user-1',
      status: VacationStatus.APPROVED,
    });
    await expect(handler.execute(manager, 'v-1', {})).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
