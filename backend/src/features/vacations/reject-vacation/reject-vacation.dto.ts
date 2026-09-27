import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectVacationRequest {
  @ApiPropertyOptional({ example: 'Período de fechamento do trimestre' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'O motivo deve ter no máximo 500 caracteres' })
  reason?: string;
}
