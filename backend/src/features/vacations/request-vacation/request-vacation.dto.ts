import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../../shared/dates/date-only.js';

export class RequestVacationRequest {
  @ApiProperty({ example: '2026-10-05', description: 'AAAA-MM-DD' })
  @Matches(DATE_ONLY_PATTERN, {
    message: 'startDate deve estar no formato AAAA-MM-DD',
  })
  startDate: string;

  @ApiProperty({ example: '2026-10-19', description: 'AAAA-MM-DD, inclusiva' })
  @Matches(DATE_ONLY_PATTERN, {
    message: 'endDate deve estar no formato AAAA-MM-DD',
  })
  endDate: string;
}
