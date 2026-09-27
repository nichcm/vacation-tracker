import type { DataSourceOptions } from 'typeorm';
import { InitialSchema1758990000000 } from '../../migrations/1758990000000-initial-schema.js';
import { AddAdminRole1759000000000 } from '../../migrations/1759000000000-add-admin-role.js';
import { User } from '../entities/user.entity.js';
import { VacationRequest } from '../entities/vacation-request.entity.js';

export function buildDataSourceOptions(
  env: NodeJS.ProcessEnv = process.env,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USER ?? 'vacation',
    password: env.DB_PASSWORD ?? 'vacation',
    database: env.DB_NAME ?? 'vacation_tracker',
    entities: [User, VacationRequest],
    migrations: [InitialSchema1758990000000, AddAdminRole1759000000000],
    synchronize: false,
  };
}
