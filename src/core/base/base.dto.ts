import {
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  IsBoolean,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Limit results',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Fields to select (comma-separated string or array)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @ApiPropertyOptional({
    description: 'Fields to populate (comma-separated string or array)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  populate?: string[];

  @ApiPropertyOptional({
    description: 'Sort field and direction (e.g., "name:asc,createdAt:desc")',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const sortObj: { [key: string]: 1 | -1 } = {};
      value.split(',').forEach((item) => {
        const [field, direction] = item.trim().split(':');
        if (field) {
          sortObj[field] = direction === 'desc' ? -1 : 1;
        }
      });
      return sortObj;
    }
    return value;
  })
  sort?: { [key: string]: 1 | -1 };

  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Use lean queries for better performance',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  lean?: boolean = true;

  @ApiPropertyOptional({
    description: 'IDs to exclude (comma-separated string or array)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  exclude?: string[];

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Date range filter - from',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Date range filter - to',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Date field for range filter',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  dateField?: string = 'createdAt';
}
