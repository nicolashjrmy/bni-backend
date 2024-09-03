import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { GraphController } from './graph/graph.controller';
import { TesterController } from './route/tester/tester.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    Neo4jModule.forRoot(
      'neo4j://192.168.18.16:7687',
      'neo4j',
      'Ddi12345!',
      'jamintel1',
    ),
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: 'testing', // Use a secure secret key in production
      signOptions: { expiresIn: '1h' }, // Adjust expiration according to your strategy
    }),
  ],
  controllers: [AppController, GraphController, TesterController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
