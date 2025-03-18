import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateVariationDto {
  @ApiProperty({ example: 'Color', description: 'Variation name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the product category',
  })
  @IsMongoId()
  productCategoryId: string;
}

export class UpdateVariationDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the variation',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: 'Size',
    description: 'Updated variation name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated product category ID',
  })
  @IsOptional()
  @IsMongoId()
  productCategoryId?: string;
}
