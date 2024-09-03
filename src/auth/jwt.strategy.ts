import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'testing',
    });
  }

  async validate(payload: any) {
    const { sub: username } = payload;
    const user = await this.userService.validateUser(username, '');
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }
    return user;
  }
}
