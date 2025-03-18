import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromotionCategoryDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description:
      'The ID of the product category that is associated with the promotion.',
  })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description:
      'The ID of the promotion that is applied to the product category.',
  })
  @IsMongoId()
  @IsNotEmpty()
  promotionId: string;
}

export class UpdatePromotionCategoryDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'The ID of the promotion category to update.',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'The updated product category ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'The updated promotion ID (optional).',
  })
  @IsMongoId()
  @IsOptional()
  promotionId?: string;
}
