import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  async hashPassword(plainPassword: string): Promise<string> {
    try {
      return await hash(plainPassword, this.saltRounds);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  async comparePassword(plainPassword: string, hashPassword: string) {
    try {
      return await compare(plainPassword, hashPassword);
    } catch (error) {
      console.log(error);
    }
  }
}
