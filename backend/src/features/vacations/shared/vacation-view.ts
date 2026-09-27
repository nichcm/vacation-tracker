import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { daysBetweenInclusive } from '../../../shared/dates/date-only.js';
import {
  type VacationRequest,
  VacationStatus,
} from '../../../shared/entities/vacation-request.entity.js';

/** Formato de resposta compartilhado pelas slices de férias. */
export class EmployeeView {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
}

export class VacationView {
  @ApiProperty() id: string;
  @ApiProperty({ example: '2026-10-05' }) startDate: string;
  @ApiProperty({ example: '2026-10-19' }) endDate: string;
  @ApiProperty({ description: 'Dias corridos, inclusive' }) days: number;
  @ApiProperty({ enum: VacationStatus }) status: VacationStatus;
  @ApiPropertyOptional({ type: String, nullable: true })
  rejectionReason: string | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) decidedAt: Date | null;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional({ type: EmployeeView }) employee?: EmployeeView;
}

export function toVacationView(vacation: VacationRequest): VacationView {
  return {
    id: vacation.id,
    startDate: vacation.startDate,
    endDate: vacation.endDate,
    days: daysBetweenInclusive(vacation.startDate, vacation.endDate),
    status: vacation.status,
    rejectionReason: vacation.rejectionReason ?? null,
    decidedAt: vacation.decidedAt ?? null,
    createdAt: vacation.createdAt,
    ...(vacation.user && {
      employee: {
        id: vacation.user.id,
        name: vacation.user.name,
        email: vacation.user.email,
      },
    }),
  };
}
