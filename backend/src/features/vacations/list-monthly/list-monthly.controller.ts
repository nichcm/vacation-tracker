import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListMonthlyQuery, ListMonthlyResponse } from './list-monthly.dto.js';
import { ListMonthlyHandler } from './list-monthly.handler.js';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class ListMonthlyController {
  constructor(private readonly handler: ListMonthlyHandler) {}

  @Get('monthly')
  @ApiOkResponse({ type: ListMonthlyResponse })
  monthly(@Query() query: ListMonthlyQuery): Promise<ListMonthlyResponse> {
    return this.handler.execute(query.month);
  }
}
