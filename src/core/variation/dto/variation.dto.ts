import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

@Schema()
export class Variation {
  @Prop()
  @ApiProperty({ example: 'Color', description: 'Variation name' })
  @IsString()
  name: string;

  @Prop()
  @ApiPropertyOptional({
    example: 'Color variation',
    description: 'Variation description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Prop({ default: true })
  @ApiPropertyOptional({
    example: true,
    description: 'Is the variation active?',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateVariationDto extends Variation {}

export class UpdateVariationDto {
  @ApiPropertyOptional({
    example: 'Size',
    description: 'Updated variation name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Size variation',
    description: 'Updated variation description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Is the variation active?',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
