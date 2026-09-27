import { BadRequestException, ConflictException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import type { Clock } from '../../../shared/clock/clock.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import {
  type VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { RequestVacationHandler } from './request-vacation.handler.js';

const employee: AuthenticatedUser = {
  id: 'user-1',
  email: 'ana@empresa.com',
  name: 'Ana',
  role: UserRole.EMPLOYEE,
};

describe('RequestVacationHandler', () => {
  let repo: {
    exists: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let handler: RequestVacationHandler;

  beforeEach(() => {
    repo = {
      exists: vi.fn().mockResolvedValue(false),
      create: vi.fn((data: Partial<VacationRequest>) => data),
      save: vi.fn((data: Partial<VacationRequest>) =>
        Promise.resolve({ id: 'v-1', createdAt: new Date(), ...data }),
      ),
    };
    const clock = { today: () => '2026-09-27', now: () => new Date() } as Clock;
    handler = new RequestVacationHandler(
      repo as unknown as Repository<VacationRequest>,
      clock,
    );
  });

  it('cria a solicitação como PENDING com a contagem de dias', async () => {
    const result = await handler.execute(employee, {
      startDate: '2026-10-05',
      endDate: '2026-10-19',
    });

    expect(result.status).toBe(VacationStatus.PENDING);
    expect(result.days).toBe(15);
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        status: VacationStatus.PENDING,
      }),
    );
  });

  it('aceita solicitação de um único dia começando hoje', async () => {
    const result = await handler.execute(employee, {
      startDate: '2026-09-27',
      endDate: '2026-09-27',
    });
    expect(result.days).toBe(1);
  });

  it('rejeita data de fim anterior à de início', async () => {
    await expect(
      handler.execute(employee, {
        startDate: '2026-10-10',
        endDate: '2026-10-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita data de início no passado', async () => {
    await expect(
      handler.execute(employee, {
        startDate: '2026-09-26',
        endDate: '2026-10-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita datas inexistentes no calendário', async () => {
    await expect(
      handler.execute(employee, {
        startDate: '2027-02-30',
        endDate: '2027-03-05',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita sobreposição com solicitação pendente ou aprovada', async () => {
    repo.exists.mockResolvedValue(true);
    await expect(
      handler.execute(employee, {
        startDate: '2026-10-05',
        endDate: '2026-10-19',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
