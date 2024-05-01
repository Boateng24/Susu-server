import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/Dtos/auth.dto';
import { PrismaService } from 'src/db-prisma/prisma-service.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async createUser(user: userDto) {
        try {
            const userExists = await this.prisma
        } catch (error) {
            
        }
    }
}
