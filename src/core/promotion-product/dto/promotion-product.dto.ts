import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePromotionProductDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'The ID of the product item that is part of the promotion.',
  })
  @IsMongoId()
  @IsNotEmpty()
  productItemId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'The ID of the promotion that applies to this product item.',
  })
  @IsMongoId()
  @IsNotEmpty()
  promotionId: string;

  @ApiPropertyOptional({
    example: 99.99,
    description:
      'The discounted price for the product during the promotion (optional).',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;
}

export class UpdatePromotionProductDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'The ID of the promotion-product relationship to update.',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated product item ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  productItemId?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Updated promotion ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  promotionId?: string;

  @ApiPropertyOptional({
    example: 89.99,
    description: 'Updated discounted price for the product (optional).',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;
}
