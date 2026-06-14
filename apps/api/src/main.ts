import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*', // Permissive for local dev, in production lock this to specific domains
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LeadFlow AI Engine')
    .setDescription('LeadFlow AI Outbound CRM and multi-agent SaaS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}/api`);
  console.log(`📖 API Docs available at: http://localhost:${port}/docs`);
}
bootstrap();
