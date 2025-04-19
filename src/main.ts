import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true, // remove propriedades não esperadas
      forbidNonWhitelisted: true, // lança erro se vier propriedade não esperada
      transform: true, // transforma para os tipos definidos nos DTOs
    }
  ));

  const config = new DocumentBuilder()
    .setTitle('API Carteira Digital')
    .setDescription('API de transações, depósitos e saques')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('wallet')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api
  
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 API is running on http://localhost:' + (process.env.PORT ?? 3000));
}
bootstrap();