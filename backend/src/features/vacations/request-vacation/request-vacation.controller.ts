import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser } from '../../../shared/auth/decorators.js';
import { VacationView } from '../shared/vacation-view.js';
import { RequestVacationRequest } from './request-vacation.dto.js';
import { RequestVacationHandler } from './request-vacation.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class RequestVacationController {
  constructor(private readonly handler: RequestVacationHandler) {}

  @Post()
  @ApiCreatedResponse({ type: VacationView })
  @ApiBadRequestResponse({ description: 'Período inválido' })
  @ApiConflictResponse({ description: 'Sobreposição com outra solicitação' })
  request(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RequestVacationRequest,
  ): Promise<VacationView> {
    return this.handler.execute(user, body);
  }
}
