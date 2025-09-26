import { Global, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { HeathModule } from './health/heath.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    // EventEmitterModule.forRoot(),
    // MailModule,
    ScheduleModule.forRoot(),
    // MessageQueueModule,
    HeathModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd =
          configService.get<string | undefined>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            autoLogging: false,
            level: isProd ? 'info' : 'debug',
            // In Local env, we use pino-pretty to format logs for human readability, not machine readability.
            transport: !isProd
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
          },
          exclude: [{ method: RequestMethod.ALL, path: 'health/readiness' }],
        };
      },
    }),
  ],
})
export class SystemModule {}
