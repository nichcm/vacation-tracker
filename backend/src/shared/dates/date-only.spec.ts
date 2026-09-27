import {
  daysBetweenInclusive,
  isValidDateOnly,
  monthRange,
} from './date-only.js';

describe('date-only', () => {
  it('valida datas de calendário', () => {
    expect(isValidDateOnly('2026-09-27')).toBe(true);
    expect(isValidDateOnly('2028-02-29')).toBe(true);
    expect(isValidDateOnly('2026-02-29')).toBe(false);
    expect(isValidDateOnly('2026-13-01')).toBe(false);
    expect(isValidDateOnly('27/09/2026')).toBe(false);
  });

  it('conta dias corridos inclusive, atravessando meses', () => {
    expect(daysBetweenInclusive('2026-09-27', '2026-09-27')).toBe(1);
    expect(daysBetweenInclusive('2026-09-28', '2026-10-02')).toBe(5);
  });

  it('calcula o intervalo do mês', () => {
    expect(monthRange('2026-09')).toEqual({
      first: '2026-09-01',
      last: '2026-09-30',
    });
    expect(monthRange('2026-12')).toEqual({
      first: '2026-12-01',
      last: '2026-12-31',
    });
  });
});
