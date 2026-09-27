import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import type { Clock } from '../../../shared/clock/clock.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import {
  type VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { ApproveVacationHandler } from './approve-vacation.handler.js';

const manager: AuthenticatedUser = {
  id: 'manager-1',
  email: 'gestor@empresa.com',
  name: 'Gestora',
  role: UserRole.MANAGER,
};

const pending = (overrides: Partial<VacationRequest> = {}) =>
  ({
    id: 'v-1',
    userId: 'user-1',
    startDate: '2026-10-05',
    endDate: '2026-10-09',
    status: VacationStatus.PENDING,
    decidedById: null,
    decidedAt: null,
    rejectionReason: null,
    createdAt: new Date(),
    ...overrides,
  }) as VacationRequest;

describe('ApproveVacationHandler', () => {
  const decidedAt = new Date('2026-09-27T12:00:00Z');
  let repo: {
    findOne: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let handler: ApproveVacationHandler;

  beforeEach(() => {
    repo = {
      findOne: vi.fn(),
      save: vi.fn((v: VacationRequest) => Promise.resolve(v)),
    };
    handler = new ApproveVacationHandler(
      repo as unknown as Repository<VacationRequest>,
      { now: () => decidedAt } as Clock,
    );
  });

  it('aprova uma solicitação pendente registrando quem decidiu', async () => {
    repo.findOne.mockResolvedValue(pending());

    const result = await handler.execute(manager, 'v-1');

    expect(result.status).toBe(VacationStatus.APPROVED);
    expect(result.decidedAt).toBe(decidedAt);
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({ decidedById: 'manager-1' }),
    );
  });

  it('permite que outro gestor aprove o pedido de um gestor', async () => {
    repo.findOne.mockResolvedValue(pending({ userId: 'manager-2' }));

    const result = await handler.execute(manager, 'v-1');

    expect(result.status).toBe(VacationStatus.APPROVED);
  });

  it('retorna 404 quando a solicitação não existe', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(handler.execute(manager, 'v-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('não permite decidir solicitação já decidida', async () => {
    repo.findOne.mockResolvedValue(
      pending({ status: VacationStatus.REJECTED }),
    );
    await expect(handler.execute(manager, 'v-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('não permite que o gestor aprove a própria solicitação', async () => {
    repo.findOne.mockResolvedValue(pending({ userId: 'manager-1' }));
    await expect(handler.execute(manager, 'v-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
