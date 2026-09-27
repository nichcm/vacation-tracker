import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser, Roles } from '../../../shared/auth/decorators.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import { VacationView } from '../shared/vacation-view.js';
import { ApproveVacationHandler } from './approve-vacation.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class ApproveVacationController {
  constructor(private readonly handler: ApproveVacationHandler) {}

  @Patch(':id/approve')
  @Roles(UserRole.MANAGER)
  @ApiOkResponse({ type: VacationView })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Solicitação já decidida' })
  approve(
    @CurrentUser() manager: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VacationView> {
    return this.handler.execute(manager, id);
  }
}
