import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { RegisterDto } from './dto/registerDto';
import { Response } from 'express';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { user, jwtToken } = await this.authService.validateUser(loginDto);

    if (!jwtToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      data: {
        ...user,
        access_token: jwtToken,
      },
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const newUser = await this.authService.registerUser(registerDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Registration successful! Please login again',
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
