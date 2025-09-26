import { join } from 'path';
import { User } from '../entities/user.entity';

export const APP_ENTITIES = [User];

export const MIGRATION_CONFIGS = {
  migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
};
