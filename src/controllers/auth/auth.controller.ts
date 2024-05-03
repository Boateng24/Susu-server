import { Body, Controller, Post } from '@nestjs/common';
import { loginDto, userDto } from 'src/Dtos/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  @Post('/newUser')
  async SingupStudent(@Body() body: userDto) {
    return await this.authservice.createUser(body);
  }

  @Post('/loginUser')
  async login(@Body() body: loginDto) {
    return await this.authservice.loginUser(body);
  }
}
