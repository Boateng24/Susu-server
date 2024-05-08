import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from './db-prisma/prisma-module.module';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { AppService } from './app.service';
import { DbconnectionService } from './config/db-connection/db-connection.service';
import { AuthService } from './services/auth/auth.service';
import { ResetpasswordService } from './services/resetpassword/resetpassword.service';
import { UserService } from './services/user/user.service';
import mailerConfig from './config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailerConfig],
    }),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get('mailer.transport'),
        defaults: configService.get('mailer.defaults'),
        template: configService.get('mailer.template'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    DbconnectionService,
    AuthService,
    ResetpasswordService,
    UserService,
  ],
})
export class AppModule {}
