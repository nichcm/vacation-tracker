import { LessThanOrEqual, MoreThanOrEqual, type Repository } from 'typeorm';
import {
  type VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';
import { ListMonthlyHandler } from './list-monthly.handler.js';

describe('ListMonthlyHandler', () => {
  it('busca aprovadas que se sobrepõem ao mês (inclusive fevereiro bissexto)', async () => {
    const find = vi.fn().mockResolvedValue([
      {
        id: 'v-1',
        userId: 'user-1',
        user: { id: 'user-1', name: 'Ana', email: 'ana@empresa.com' },
        startDate: '2028-01-25',
        endDate: '2028-02-03',
        status: VacationStatus.APPROVED,
        createdAt: new Date(),
      },
    ]);
    const handler = new ListMonthlyHandler({
      find,
    } as unknown as Repository<VacationRequest>);

    const result = await handler.execute('2028-02');

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: VacationStatus.APPROVED,
          startDate: LessThanOrEqual('2028-02-29'),
          endDate: MoreThanOrEqual('2028-02-01'),
        },
      }),
    );
    expect(result.month).toBe('2028-02');
    expect(result.items[0].employee?.name).toBe('Ana');
    expect(result.items[0].days).toBe(10);
  });
});
