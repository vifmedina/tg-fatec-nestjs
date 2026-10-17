import { Injectable, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_COLUMNS =
  'id, name, age, status AS isActive, created_at AS createdAt';

@Injectable()
export class UserService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      typeCast: (field, next) =>
        field.type === 'TINY' && field.length === 1
          ? field.string() === '1'
          : next(),
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, age, isActive } = createUserDto;
    const statusValue = isActive ?? true;
    const createdAt = new Date();

    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO users (name, age, status, created_at) VALUES (?, ?, ?, ?)',
      [name, age, statusValue, createdAt],
    );

    return {
      id: result.insertId,
      name,
      age,
      isActive: statusValue,
      createdAt
    };
  }

  async findAll() {
    const [rows] = await this.pool.execute(
      `SELECT ${USER_COLUMNS} FROM users LIMIT 1000`,
    );
    return rows;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = ?`,
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException();
    }
    return rows[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const name = updateUserDto.name ?? null;
    const age = updateUserDto.age ?? null;
    const isActive = updateUserDto.isActive ?? null;

    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      'UPDATE users SET name = COALESCE(?, name), age = COALESCE(?, age), status = COALESCE(?, status) WHERE id = ?',
      [name, age, isActive, id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException();
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id],
    );
    if (result.affectedRows === 0) {
      throw new NotFoundException();
    }
  }
}