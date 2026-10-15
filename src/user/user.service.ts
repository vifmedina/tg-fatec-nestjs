import { Injectable, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_COLUMNS = 'id, name, age, status AS isActive, created_at AS createdAt';

@Injectable()
export class UserService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      // Return TINYINT(1) columns as booleans, like the ASP.NET Core API
      typeCast: (field, next) =>
        field.type === 'TINY' && field.length === 1 ? field.string() === '1' : next(),
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, age } = createUserDto;
    const createdAt = new Date();
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO users (name, age, status, created_at) VALUES (?, ?, ?, ?)',
      [name, age, true, createdAt],
    );
    return { id: result.insertId, name, age, isActive: true, createdAt };
  }

  async findAll() {
    const [rows] = await this.pool.execute(`SELECT ${USER_COLUMNS} FROM users LIMIT 1000`);
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

  // Single UPDATE statement; fields left out of the body keep their current value
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
    return { id, name, age, isActive };
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
