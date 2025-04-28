import { HttpStatus } from '@nestjs/common';
import { PopulateOptions, Types } from 'mongoose';

export type UserRole = 'admin' | 'user' | 'editor';

export interface IToken {
  type: string;
  accessToken: string;
  refreshToken: string;
}

export interface CustomOptions<T> {
  errThrowing?: boolean;
  errMessage?: string;
  errCode?: HttpStatus;
  lean?: boolean;
  populate?: (keyof T | string)[];
  fields?: string[];
  lastId?: Types.ObjectId;
  orientation?: 1 | -1;
  limit?: number;
  page?: number;
  pageSize?: number;
  exclude?: Types.ObjectId[];
  sort?: { [key: string]: 1 | -1 };
  populates?: PopulateOptions[];
}
