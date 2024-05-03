import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto, userDto } from 'src/Dtos/auth.dto';
import { PrismaService } from 'src/db-prisma/prisma-service.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(user: userDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (userExists) {
        throw new ConflictException('User already exists');
      }
      if (user.password !== user.confirmPassword) {
        throw new NotAcceptableException('Password Mismatch');
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          fullname: user.fullname,
          email: user.email,
          password: hashedPassword,
        },
      });

      return {
        createdUser: newUser,
        message: 'User created succeffully',
      };
    } catch (error) {
      throw error;
    }
  }

  async loginUser({ email, password }: loginDto) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!foundUser) {
        throw new NotFoundException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) {
        throw new ConflictException({ message: 'Invalid Credentials' });
      }

      const payload = { id: foundUser.userId };
      const userToken = await this.jwtService.signAsync(payload);

      return {
        userId: foundUser.userId,
        loggedInUser: foundUser.fullname,
        accessToken: userToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
