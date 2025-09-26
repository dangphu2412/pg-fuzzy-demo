import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SystemModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // folder for static files
    }),
  ],
})
export class AppModule {}
