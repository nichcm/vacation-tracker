import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser } from '../../../shared/auth/decorators.js';
import { VacationView } from '../shared/vacation-view.js';
import { ListMyVacationsHandler } from './list-my-vacations.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class ListMyVacationsController {
  constructor(private readonly handler: ListMyVacationsHandler) {}

  @Get('mine')
  @ApiOkResponse({ type: VacationView, isArray: true })
  mine(@CurrentUser() user: AuthenticatedUser): Promise<VacationView[]> {
    return this.handler.execute(user.id);
  }
}
