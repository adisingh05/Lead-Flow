import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Configure CORS from env in production; allow all only in non-production
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (process.env.NODE_ENV === "production") {
    if (allowedOrigins.length === 0) {
      // Fail safe: do not enable permissive CORS in production
      app.enableCors({ origin: false });
    } else {
      app.enableCors({ origin: allowedOrigins, credentials: true });
    }
  } else {
    // Local/dev convenience: allow all origins but do not expose credentials to everyone
    app.enableCors({ origin: "*" });
  }

  const config = new DocumentBuilder()
    .setTitle("LeadFlow AI Engine")
    .setDescription("LeadFlow AI Outbound CRM and multi-agent SaaS API")
    .setVersion("1.0")
    .addBearerAuth()
    .addSecurityRequirements("bearer")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}/api`);
  console.log(`📖 API Docs available at: http://localhost:${port}/docs`);
}
bootstrap();
