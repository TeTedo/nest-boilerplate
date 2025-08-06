import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV_DB_HOST_KEY } from './common/const/env-keys.const';
import { ENV_DB_PORT_KEY } from './common/const/env-keys.const';
import { ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { ENV_DB_PASSWORD_KEY } from './common/const/env-keys.const';
import { ENV_DB_DATABASE_KEY } from './common/const/env-keys.const';
import { MemberModule } from './modules/member/member.module';
import { AuthModule } from './modules/auth/auth.module';
import { SampleModule } from './modules/sample/sample.module';
import { LogMiddleware } from './common/middleware/log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env[ENV_DB_HOST_KEY] ?? 'localhost',
      port: parseInt(process.env[ENV_DB_PORT_KEY] ?? '3306'),
      username: process.env[ENV_DB_USERNAME_KEY] ?? 'root',
      password: process.env[ENV_DB_PASSWORD_KEY] ?? '',
      database: process.env[ENV_DB_DATABASE_KEY] ?? 'nest_boilerplate',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MemberModule,
    AuthModule,
    SampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
