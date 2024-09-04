import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/loginDto';
import { RegisterDto } from './dto/registerDto';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    loginDto: LoginDto,
  ): Promise<{ user: any; jwtToken: string } | null> {
    const { username, password } = loginDto;

    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.userId };
    const jwtToken = this.jwtService.sign(payload);

    return { user, jwtToken };
  }

  async registerUser(registerDto: RegisterDto): Promise<{ newUser: any }> {
    const { username, email, password, confirm_password } = registerDto;

    
    const existingUser = await this.userService.findOne(username);
    if (existingUser) {
        throw new ConflictException('Username already exist!');
    }
    
    const existingEmail = await this.userService.findOneEmail(email);
    if (existingEmail) {
        throw new ConflictException('Email already used!');
    }
    
    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match!');
    }
    const newUser = await this.userService.registerUser(
      username,
      email,
      password,
    );

    return null;
  }
}
