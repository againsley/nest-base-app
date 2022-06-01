import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// https://aqueous-dusk-34506.herokuapp.com/
// COOKIE_KEY asdf1234fdas4321
