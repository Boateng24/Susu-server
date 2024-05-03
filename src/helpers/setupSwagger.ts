import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Susu Server API documentation')
    .setDescription(
      'This is the official API documentation of the susu server app',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('SUSU SERVER')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
};
