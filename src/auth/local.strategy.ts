import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    });
  }

  async validate(LoginDto:LoginDto): Promise<any> {
    const user = await this.authService.validateUser(LoginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
