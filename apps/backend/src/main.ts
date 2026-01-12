import { AppModule } from '@/app.module';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';

patchNestjsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('tiny'));

  const config = new DocumentBuilder()
    .setTitle('Direct Ferries API')
    .setDescription('Ferry search API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
}

bootstrap();
