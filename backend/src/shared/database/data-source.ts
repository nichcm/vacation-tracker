import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './database.config.js';

// Usado pela CLI do TypeORM e pelo seed, fora do contexto do Nest.
try {
  process.loadEnvFile();
} catch {
  // Sem arquivo .env: usa apenas as variáveis de ambiente do processo.
}

export default new DataSource(buildDataSourceOptions());
