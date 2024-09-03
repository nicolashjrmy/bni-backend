import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getAllUsers() {
    const result = await this.neo4jService.read(
      `MATCH (n:_META_USER) RETURN n.username AS username, n.password AS password`,
    );
    return result.records.map((record) => ({
      username: record.get('username'),
      password: record.get('password'),
    }));
  }

  async findOne(username: string) {
    const result = await this.neo4jService.read(
      `MATCH (n:_META_USER {username: $username}) RETURN n.username AS username, n.password AS password, n.role AS role`,
      { username },
    );

    const record = result.records[0];
    if (record) {
      return {
        username: record.get('username'),
        password: record.get('password'),
        role: record.get('role'),
      };
    }

    return null;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
