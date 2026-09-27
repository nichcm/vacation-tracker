import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser, Roles } from '../../../shared/auth/decorators.js';
import { APPROVER_ROLES } from '../../../shared/entities/user.entity.js';
import { VacationView } from '../shared/vacation-view.js';
import { ListPendingHandler } from './list-pending.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class ListPendingController {
  constructor(private readonly handler: ListPendingHandler) {}

  @Get('pending')
  @Roles(...APPROVER_ROLES)
  @ApiOkResponse({ type: VacationView, isArray: true })
  @ApiForbiddenResponse({ description: 'Somente gestores e administradores' })
  pending(@CurrentUser() user: AuthenticatedUser): Promise<VacationView[]> {
    return this.handler.execute(user.id);
  }
}
