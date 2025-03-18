import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateVariationOptionDto {
  @ApiProperty({ example: 'Red', description: 'Value of the variation option' })
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
