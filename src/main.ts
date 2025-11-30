import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception-filter/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 전역 예외 필터: 모든 예외를 일관된 형식으로 처리
  // ResponseInterceptor는 AppModule에서 APP_INTERCEPTOR로 등록됨
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 8080, () => {
    if (process.send) {
      process.send('ready');
    }
    console.log(`listening on port : ${process.env.PORT}`);
  });
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
