import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { MONTH_PATTERN } from '../../../shared/dates/date-only.js';
import { VacationView } from '../shared/vacation-view.js';

export class ListMonthlyQuery {
  @ApiProperty({ example: '2026-10', description: 'Mês no formato AAAA-MM' })
  @Matches(MONTH_PATTERN, { message: 'month deve estar no formato AAAA-MM' })
  month: string;
}

export class ListMonthlyResponse {
  @ApiProperty({ example: '2026-10' }) month: string;
  @ApiProperty({ type: VacationView, isArray: true }) items: VacationView[];
}
