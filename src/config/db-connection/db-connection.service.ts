import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db-prisma/prisma-service.service';

@Injectable()
export class DbconnectionService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(DbconnectionService.name);

  async connection() {
    try {
      await this.prisma.$connect().then(() => {
        this.logger.log('Database connected successfully');
        this.logger.log(`Server listening on port:${process.env.PORT}`);
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
