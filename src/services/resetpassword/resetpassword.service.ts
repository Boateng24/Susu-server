import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
// import { resetDto } from 'src/Dtos/auth.dto';

@Injectable()
export class ResetpasswordService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailerService,
    private userService: UserService,
  ) {}

  async generateResetToken(email: string): Promise<string> {
    try {
      const foundUser = await this.userService.findUserByMail(email);
      if (!foundUser) {
        throw new Error('User does not exist');
      }

      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });

      // Save the token in the database or some storage with the user reference
      await this.userService.saveResetToken(email, token);

      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    try {
      const user = await this.userService.findUserByMail(email);
      if (!user) {
        throw new Error('User not found');
      }
      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: './../../templates/reset-password.hbs', // path to your template
        context: {
          fullname: user.fullname,
          resetLink,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByMail(payload.email);
      if (!user) {
        throw new Error('Invalid token');
      }

      // Here you would hash the new password before saving
      await this.userService.updatePassword(user.userId, newPassword);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
