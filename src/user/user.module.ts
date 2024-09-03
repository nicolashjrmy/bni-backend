import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Module({
  providers: [UserService, Neo4jService],
  exports: [UserService]
})
export class UserModule {}
