import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../shared/auth/authenticated-user.js';
import { CurrentUser } from '../../../shared/auth/decorators.js';
import { LoggedUser } from '../login/login.dto.js';
import { GetMeHandler } from './get-me.handler.js';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class GetMeController {
  constructor(private readonly handler: GetMeHandler) {}

  @Get('me')
  @ApiOkResponse({ type: LoggedUser })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.handler.execute(user.id);
  }
}
