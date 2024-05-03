import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { AppService } from './app.service';
import { AuthService } from './services/auth/auth.service';
import { DbconnectionService } from './config/db-connection/db-connection.service';
import { PrismaModule } from './db-prisma/prisma-module.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, DbconnectionService, AuthService],
})
export class AppModule {}
