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

  async findOneEmail(email: string) {
    const result = await this.neo4jService.read(
      `MATCH (n:_META_USER {email: $email}) RETURN n.email as email`,
      { email },
    );
    const record = result.records[0];
    if (record) {
      return {
        email: record.get('email'),
      };
    }

    return null;
  }

  async findOne(username: string) {
    const result = await this.neo4jService.read(
      `MATCH (n:_META_USER {username: $username}) RETURN n.username AS username, n.password AS password, n.role AS role, n.email as email, id(n) as id`,
      { username },
    );

    const record = result.records[0];
    if (record) {
      return {
        id: record.get('id').low,
        username: record.get('username'),
        password: record.get('password'),
        role: record.get('role'),
        email: record.get('email'),
      };
    }

    return null;
  }

  async registerUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.neo4jService.read(
      ` CREATE (user:_META_USER{username: $username, email: $email})
          SET 
              user.username = $username,
              user.email = $email,
              user.password = $hashedPassword,
              user.role = "admin" `,
      { username, email, hashedPassword },
    );
    return newUser;
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
