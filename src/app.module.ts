import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { GraphController } from './graph/graph.controller';
import { TesterController } from './route/tester/tester.controller';

@Module({
  imports: [
    Neo4jModule.forRoot(
      'neo4j://192.168.18.16:7687',
      'neo4j',
      'Ddi12345!',
      'jamintel1',
    ),
  ],
  controllers: [AppController, GraphController, TesterController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
