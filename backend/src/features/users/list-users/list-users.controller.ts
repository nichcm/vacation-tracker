import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../shared/auth/decorators.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import { UserView } from '../shared/user-view.js';
import { ListUsersHandler } from './list-users.handler.js';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class ListUsersController {
  constructor(private readonly handler: ListUsersHandler) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: UserView, isArray: true })
  @ApiForbiddenResponse({ description: 'Somente administradores' })
  list(): Promise<UserView[]> {
    return this.handler.execute();
  }
}
