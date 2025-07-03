import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromotionProductDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'The ID of the product that is part of the promotion.',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'The ID of the promotion that applies to this product.',
  })
  @IsMongoId()
  @IsNotEmpty()
  promotionId: string;
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
    description: 'Updated product ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Updated promotion ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  promotionId?: string;
}
