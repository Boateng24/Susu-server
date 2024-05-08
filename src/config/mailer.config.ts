// src/config/mailer.config.ts
import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export default registerAs('mailer', () => ({
  transport: {
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT, 10),
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
    secure: process.env.MAILER_SECURE, // Ensure boolean
  },
  defaults: {
    from: '"No Reply" <no-reply@example.com>',
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}));
