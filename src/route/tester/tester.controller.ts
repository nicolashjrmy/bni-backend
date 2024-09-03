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
  async getGraphProfilBuron(
    @Query('nik') nik: string,
    @Query('no_hp') no_hp: string,
    @Query('no_rek') no_rek: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('email') email: string,
    @Query('n_kontak1') n_kontak1: string,
    @Query('tgl_cctv') tgl_cctv: string,
  ) {
    const result = await this.neo4jService.read(
      `match p = ()--()

       return p LIMIT 50`,
    );
    // console.log(result.records);
    const formatResult = formatResponse(result.records);
    return formatResult;
    // return result.records;
  }
}
