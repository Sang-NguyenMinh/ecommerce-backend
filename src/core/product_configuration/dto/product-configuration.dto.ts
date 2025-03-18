import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class CreateProductConfigurationDto {
  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the product item',
  })
  @IsMongoId()
  productItemId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'ID of the variation option',
  })
  @IsMongoId()
  variationOptionId: string;
}

export class UpdateProductConfigurationDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the product configuration',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Updated product item ID',
  })
  @IsOptional()
  @IsMongoId()
  productItemId?: string;

  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8f',
    description: 'Updated variation option ID',
  })
  @IsOptional()
  @IsMongoId()
  variationOptionId?: string;
}
