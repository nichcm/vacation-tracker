import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetMeModule } from './features/auth/get-me/get-me.module.js';
import { LoginModule } from './features/auth/login/login.module.js';
import { CreateUserModule } from './features/users/create-user/create-user.module.js';
import { ListUsersModule } from './features/users/list-users/list-users.module.js';
import { ApproveVacationModule } from './features/vacations/approve-vacation/approve-vacation.module.js';
import { ListMonthlyModule } from './features/vacations/list-monthly/list-monthly.module.js';
import { ListMyVacationsModule } from './features/vacations/list-my-vacations/list-my-vacations.module.js';
import { ListPendingModule } from './features/vacations/list-pending/list-pending.module.js';
import { RejectVacationModule } from './features/vacations/reject-vacation/reject-vacation.module.js';
import { RequestVacationModule } from './features/vacations/request-vacation/request-vacation.module.js';
import { SharedAuthModule } from './shared/auth/auth.module.js';
import { ClockModule } from './shared/clock/clock.js';
import { buildDataSourceOptions } from './shared/database/database.config.js';

@Module({
  imports: [
    // Infraestrutura transversal
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...buildDataSourceOptions(), migrationsRun: true }),
    }),
    SharedAuthModule,
    ClockModule,

    // Vertical slices
    LoginModule,
    GetMeModule,
    RequestVacationModule,
    ListMyVacationsModule,
    ListPendingModule,
    ApproveVacationModule,
    RejectVacationModule,
    ListMonthlyModule,
    CreateUserModule,
    ListUsersModule,
  ],
})
export class AppModule {}
