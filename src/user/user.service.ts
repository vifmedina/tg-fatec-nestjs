import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: 'localhost',
      port: 3307,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, age, status } = createUserDto;
    const [result] = await this.pool.execute(
      'INSERT INTO users (name, age, status) VALUES (?, ?, ?)',
      [name, age, status],
    );
    return { id: (result as any).insertId, ...createUserDto };
  }

  async findAll() {
    const [rows] = await this.pool.execute('SELECT * FROM users');
    return rows;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as any)[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (updateUserDto.name !== undefined) {
      fields.push('name = ?');
      values.push(updateUserDto.name);
    }

    if (updateUserDto.age !== undefined) {
      fields.push('age = ?');
      values.push(updateUserDto.age);
    }

    if (updateUserDto.status !== undefined) {
      fields.push('status = ?');
      values.push(updateUserDto.status);
    }

    if (fields.length === 0) {
      return { id };
    }

    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool.execute(query, values);

    return { id, ...updateUserDto };
  }

  async remove(id: number) {
    await this.pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return { message: `User #${id} deleted successfuly`};
  }
}
