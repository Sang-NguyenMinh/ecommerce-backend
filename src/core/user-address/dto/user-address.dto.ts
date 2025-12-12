import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ example: '65f25a3d6e4b3b001c2d5a8e', description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người nhận' })
  @IsString()
  recipientName: string;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '123 Lê Lợi',
    description: 'Địa chỉ chi tiết',
  })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Quận 1', description: 'Quận/Huyện' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'TP. Hồ Chí Minh', description: 'Tỉnh/Thành phố' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Phường 18', description: 'Phường/xã' })
  @IsString()
  ward: string;
}

export class UpdateUserAddressDto {
  @ApiPropertyOptional({
    example: 'Nguyễn Văn B',
    description: 'Tên người nhận',
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ example: '0907654321', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: '456 Nguyễn Huệ',
    description: 'Địa chỉ chi tiết',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Quận 3', description: 'Quận/Huyện' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    example: 'TP. Hồ Chí Minh',
    description: 'Tỉnh/Thành phố',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'Phường 18', description: 'Phường/xã' })
  @IsString()
  ward?: string;
}
