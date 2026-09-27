import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../shared/auth/decorators.js';
import { UserRole } from '../../../shared/entities/user.entity.js';
import { UserView } from '../shared/user-view.js';
import { CreateUserRequest } from './create-user.dto.js';
import { CreateUserHandler } from './create-user.handler.js';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class CreateUserController {
  constructor(private readonly handler: CreateUserHandler) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({ type: UserView })
  @ApiConflictResponse({ description: 'E-mail já cadastrado' })
  @ApiForbiddenResponse({ description: 'Somente administradores' })
  create(@Body() body: CreateUserRequest): Promise<UserView> {
    return this.handler.execute(body);
  }
}
