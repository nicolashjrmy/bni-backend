import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'testing',
      signOptions: { expiresIn: '60000000000m' },
    }),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, Neo4jService],
  controllers: [AuthController],
})
export class AuthModule {}
