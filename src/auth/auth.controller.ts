import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { Response } from 'express'; // Import the correct Response type

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const jwtToken = await this.authService.validateUser(loginDto);

    if (!jwtToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
