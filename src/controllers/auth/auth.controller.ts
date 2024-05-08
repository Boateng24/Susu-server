import { Body, Controller, Post, Query } from '@nestjs/common';
import { loginDto, userDto } from 'src/Dtos/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { ResetpasswordService } from 'src/services/resetpassword/resetpassword.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly resetPasswordService: ResetpasswordService,
  ) {}
  @Post('/newUser')
  async SingupStudent(@Body() body: userDto) {
    return await this.authservice.createUser(body);
  }

  @Post('/loginUser')
  async login(@Body() body: loginDto) {
    return await this.authservice.loginUser(body);
  }

  @Post('/forgot-password')
  async requestResetPassword(@Body('email') email: string) {
    const token = await this.resetPasswordService.generateResetToken(email);
    await this.resetPasswordService.sendResetPasswordEmail(email, token);
    return { message: 'Reset password link has been sent to your email.' };
  }

  @Post('/reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.resetPasswordService.resetPassword(token, newPassword);
    return { message: 'Your password has been successfully reset.' };
  }
}
