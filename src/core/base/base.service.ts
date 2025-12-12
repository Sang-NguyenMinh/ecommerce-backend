import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, FilterQuery, Types, PopulateOptions, Document } from 'mongoose';

export interface CustomOptions<T> {
  errThrowing?: boolean;
  errMessage?: string;
  errCode?: HttpStatus;
  lean?: boolean;
  populate?: (keyof T | string)[];
  fields?: string[];
  limit?: number;
  page?: number;
  pageSize?: number;
  exclude?: Types.ObjectId[];
  sort?: { [key: string]: 1 | -1 };
  populates?: PopulateOptions[];
}

export interface BaseQueryResult<T> {
  data: T[];
  total: number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BaseSelectOption {
  value: any;
  label: string;
  data?: any;
}

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(
    filter?: FilterQuery<T>,
    options?: CustomOptions<T>,
  ): Promise<BaseQueryResult<T | any>> {
    const {
      lean = true,
      populate = [],
      fields,
      limit,
      page,
      pageSize,
      exclude = [],
      sort,
      populates = [],
      errThrowing = true,
      errMessage = 'Error fetching data',
      errCode = HttpStatus.INTERNAL_SERVER_ERROR,
    } = options || {};

    try {
      const finalFilter: FilterQuery<T> = {
        ...filter,
        ...(exclude.length > 0 && { _id: { $nin: exclude } }),
      };

      let sortObject: { [key: string]: 1 | -1 } = {};
      if (sort) {
        sortObject = sort;
      } else {
        sortObject = { createdAt: -1 };
      }

      const shouldPaginate = page !== undefined || pageSize !== undefined;

      let currentLimit = 0;
      let skip = 0;
      let currentPage = 1;
      let currentPageSize = 10;

      if (shouldPaginate) {
        currentPage = page || 1;
        currentPageSize = pageSize || 10;
        currentLimit = limit || currentPageSize;
        skip = currentPage > 1 ? (currentPage - 1) * currentLimit : 0;
      } else if (limit) {
        currentLimit = limit;
      }

      const total = await this.model.countDocuments(finalFilter);

      let query = this.model.find(finalFilter);

      // Apply field selection
      if (fields && fields.length > 0) {
        query = query.select(fields.join(' '));
      }

      if (populate && populate.length > 0) {
        populate.forEach((field) => {
          query = query.populate(field as string) as any;
        });
      }

      if (populates && populates.length > 0) {
        populates.forEach((populateOption) => {
          query = query.populate(populateOption) as any;
        });
      }

      if (lean) {
        query = query.lean();
      }

      query = query.sort(sortObject);
      if (currentLimit > 0) {
        query = query.limit(currentLimit);
      }

      if (shouldPaginate) {
        if (currentLimit > 0) {
          query = query.limit(currentLimit);
        }

        if (skip > 0) {
          query = query.skip(skip);
        }
      }

      const data = (await query.exec()) as T[];

      const result: BaseQueryResult<T | any> = {
        data,
        total,
      };

      if (shouldPaginate) {
        result.pagination = {
          page: currentPage,
          pageSize: currentLimit,
          total,
          totalPages: Math.ceil(total / currentLimit),
          hasNext: currentPage * currentLimit < total,
          hasPrev: currentPage > 1,
        };
      }

      return result;
    } catch (error) {
      if (errThrowing) {
        console.log(error);
        throw new HttpException(errMessage, errCode);
      }

      console.error(`Error in ${this.constructor.name}.findAll:`, error);

      return {
        data: [],
        total: 0,
      };
    }
  }

  async findForSelect(
    filter?: FilterQuery<T>,
    options?: {
      valueField?: keyof T | string;
      labelField?: keyof T | string;
      limit?: number;
      additionalFields?: string[];
    },
  ): Promise<BaseSelectOption[]> {
    const {
      valueField = '_id',
      labelField = 'name',
      limit = 100,
      additionalFields = [],
    } = options || {};

    const fields = [
      valueField as string,
      labelField as string,
      ...additionalFields,
    ];

    const result = await this.findAll(filter, {
      fields,
      limit,
      lean: true,
      sort: { [labelField as string]: 1 },
    });

    return result.data.map((item: any) => ({
      value: item[valueField as keyof T],
      label: item[labelField as keyof T] as string,
      data: item,
    }));
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: Omit<CustomOptions<T>, 'page' | 'pageSize' | 'limit'>,
  ): Promise<T | null> {
    const {
      lean = true,
      populate = [],
      fields,
      populates = [],
      errThrowing = true,
      errMessage = 'Document not found',
      errCode = HttpStatus.NOT_FOUND,
    } = options || {};

    try {
      let query = this.model.findOne(filter);

      if (fields && fields.length > 0) {
        query = query.select(fields.join(' '));
      }

      if (populate && populate.length > 0) {
        populate.forEach((field) => {
          query = query.populate(field as string) as any;
        });
      }

      if (populates && populates.length > 0) {
        populates.forEach((populateOption) => {
          query = query.populate(populateOption) as any;
        });
      }

      if (lean) {
        query = query.lean();
      }

      const result = (await query.exec()) as T | null;

      if (!result && errThrowing) {
        throw new HttpException(errMessage, errCode);
      }

      return result;
    } catch (error) {
      if (errThrowing && error instanceof HttpException) {
        throw error;
      }

      if (errThrowing) {
        throw new HttpException(errMessage, errCode);
      }

      console.error(`Error in ${this.constructor.name}.findOne:`, error);
      return null;
    }
  }

  async findById(
    id: Types.ObjectId,
    options?: Omit<CustomOptions<T>, 'page' | 'pageSize' | 'limit'>,
  ): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    return this.findOne({ _id: id } as FilterQuery<T>, options);
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    try {
      return await this.model.countDocuments(filter || {});
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.count:`, error);
      throw new HttpException(
        'Error counting documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter);
      return !!result;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.exists:`, error);
      throw new HttpException(
        'Error checking document existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected buildSearchFilter(
    search: string,
    searchFields: string[],
  ): FilterQuery<T> {
    if (!search || !searchFields.length) return {};

    const searchRegex = new RegExp(search, 'i');
    return {
      $or: searchFields.map((field) => ({
        [field]: searchRegex,
      })),
    } as FilterQuery<T>;
  }

  protected buildDateRangeFilter(
    dateFrom?: Date,
    dateTo?: Date,
    dateField = 'createdAt',
  ): FilterQuery<T> {
    const dateFilter: any = {};

    if (dateFrom) {
      dateFilter.$gte = dateFrom;
    }

    if (dateTo) {
      dateFilter.$lte = dateTo;
    }

    return Object.keys(dateFilter).length > 0
      ? ({ [dateField]: dateFilter } as FilterQuery<T>)
      : {};
  }

  protected convertToObjectIds(ids: string[]): Types.ObjectId[] {
    return ids.map((id) => new Types.ObjectId(id));
  }
}
