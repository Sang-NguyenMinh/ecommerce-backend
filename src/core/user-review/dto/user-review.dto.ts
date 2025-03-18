import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserReviewDto {
  @ApiProperty({ example: '65f25a3d6e4b3b001c2d5a8e', description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Order Line ID',
  })
  @IsMongoId()
  orderedProductId: string;

  @ApiProperty({
    example: 5,
    description: 'Rating value (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  ratingValue: number;

  @ApiProperty({
    example: 'Great product!',
    description: 'Review comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
export class UpdateUserReviewDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'Review ID',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Updated rating value (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingValue?: number;

  @ApiPropertyOptional({
    example: 'I changed my mind, it’s okay.',
    description: 'Updated comment',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
