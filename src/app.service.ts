import { Injectable } from '@nestjs/common';
import { DbconnectionService } from './config/db-connection/db-connection.service';

@Injectable()
export class AppService {
  constructor(private readonly dbConnectionService: DbconnectionService) {}

  async onApplicationBootstrap() {
    await this.dbConnectionService.connection();
  }
}
