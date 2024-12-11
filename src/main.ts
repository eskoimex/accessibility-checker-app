import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Use CORS middleware
  app.use(
    cors({
      origin: ['https://accessibility-checker-app-fe.onrender.com', 'http://localhost:3000'], // Allow requests from frontend
      methods: 'GET,POST',
      allowedHeaders: 'Content-Type',
    }),
  );
  await app.listen(process.env.PORT ?? 5000);


}
bootstrap();
