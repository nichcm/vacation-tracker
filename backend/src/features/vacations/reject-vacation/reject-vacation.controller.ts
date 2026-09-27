import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser, Roles } from '../../../shared/auth/decorators.js';
import { APPROVER_ROLES } from '../../../shared/entities/user.entity.js';
import { VacationView } from '../shared/vacation-view.js';
import { RejectVacationRequest } from './reject-vacation.dto.js';
import { RejectVacationHandler } from './reject-vacation.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class RejectVacationController {
  constructor(private readonly handler: RejectVacationHandler) {}

  @Patch(':id/reject')
  @Roles(...APPROVER_ROLES)
  @ApiOkResponse({ type: VacationView })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Solicitação já decidida' })
  reject(
    @CurrentUser() manager: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: RejectVacationRequest,
  ): Promise<VacationView> {
    return this.handler.execute(manager, id, body);
  }
}
