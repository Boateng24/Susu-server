import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db-prisma/prisma-service.service';
import * as bcrypt from 'bcryptjs';
// import { hashedPassword } from 'src/helpers/bcrypthash';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByMail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
  async updatePassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    console.log(`Password updated for user: ${updatedUser.userId}`);
  }

  async saveResetToken(email: string, token: string) {
    try {
      const user = await this.prisma.user.update({
        where: { email: email },
        data: { token: token },
      });
      return user;
    } catch (error) {
      console.error('Error saving reset token:', error);
      throw error;
    }
  }
}
