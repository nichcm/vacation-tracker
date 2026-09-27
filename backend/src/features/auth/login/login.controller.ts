import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../../shared/auth/decorators.js';
import { LoginRequest, LoginResponse } from './login.dto.js';
import { LoginHandler } from './login.handler.js';

@ApiTags('auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly handler: LoginHandler) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.handler.execute(body);
  }
}
