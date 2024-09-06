import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { formatResponse, formatProperties } from 'src/neo4j/neo4j.utils';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tester')
export class TesterController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('graph-profil-buron')
  async getGraphProfilBuron() {
    const result = await this.neo4jService.read(
      `match p = ()--()

       return p LIMIT 50`,
    );
    // console.log(result.records);
    const formatResult = formatResponse(result.records);
    return formatResult;
    // return result.records;
  }

  @Get('pie')
  async getPie() {
    const result = await this.neo4jService.read(
      `match (n:Buronan{jenis_kelamin:'Perempuan'})
       with count(n) as wanita
       match (m:Buronan{jenis_kelamin: 'Laki-laki'})
       return wanita, count(m) as pria`,
    );
    const pria = result.records[0].get('pria').toInt();
    const wanita = result.records[0].get('wanita').toInt();
    const total = pria + wanita;

    const priaPercentage = ((pria / total) * 100).toFixed(2);
    const wanitaPercentage = ((wanita / total) * 100).toFixed(2);

    return {
      Pria: pria,
      Wanita: wanita,
      PriaPercentage: `${priaPercentage}%`,
      WanitaPercentage: `${wanitaPercentage}%`,
    };
  }
}
