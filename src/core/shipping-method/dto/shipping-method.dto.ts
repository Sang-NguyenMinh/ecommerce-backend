import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateShippingMethodDto {
  @ApiProperty({
    example: 'Standard Shipping',
    description: 'Name of the shipping method',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 5.99, description: 'Price of the shipping method' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateShippingMethodDto {
  @ApiPropertyOptional({
    example: '65f25a3d6e4b3b001c2d5a8e',
    description: 'ID of the shipping method',
  })
  @IsMongoId()
  id: string;

  @ApiPropertyOptional({
    example: 'Express Shipping',
    description: 'Updated name of the shipping method',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 9.99,
    description: 'Updated price of the shipping method',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
