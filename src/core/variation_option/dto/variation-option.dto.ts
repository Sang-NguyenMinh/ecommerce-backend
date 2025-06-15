import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/core/base/base.dto';

export class CreateVariationOptionDto {
  @ApiProperty({ example: 'Red', description: 'name of the variation option' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'red', description: 'Value of the variation option' })
  @IsString()
  value: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the variation',
  })
  @IsMongoId()
  variationId: string;
}

export class UpdateVariationOptionDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the variation option',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: 'Blue',
    description: 'Updated name of the variation option',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Blue',
    description: 'Updated value of the variation option',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated variation ID',
  })
  @IsOptional()
  @IsMongoId()
  variationId?: string;
}

export class VariationOptionQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by variation ID' })
  @IsOptional()
  @IsString()
  variationId?: string;

  @ApiPropertyOptional({ description: 'Filter by option value' })
  @IsOptional()
  @IsString()
  value?: string;
}
