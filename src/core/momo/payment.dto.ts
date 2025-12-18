import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Mã đơn hàng duy nhất',
    example: 'ORDER_' + Date.now(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Số tiền thanh toán (VND)',
    example: 50000,
    minimum: 1000,
    maximum: 50000000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(50000000)
  amount: number;

  @ApiProperty({
    description: 'Thông tin đơn hàng',
    example: 'Thanh toán đơn hàng #123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderInfo: string;
}

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Trạng thái tạo payment',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message',
    example: 'Payment link created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'URL để redirect user đến trang thanh toán MoMo',
    example:
      'https://test-payment.momo.vn/gw_payment/payment/qr?partnerCode=...',
    required: false,
  })
  payUrl?: string;

  @ApiProperty({
    description: 'Deep link để mở app MoMo trực tiếp',
    example: 'momo://app?action=payWithApp&...',
    required: false,
  })
  deeplink?: string;

  @ApiProperty({
    description: 'URL QR code để scan',
    example:
      'https://test-payment.momo.vn/gw_payment/payment/qr?partnerCode=...',
    required: false,
  })
  qrCodeUrl?: string;
}

export class MomoCallbackQueryDto {
  @ApiProperty({ description: 'Partner code', required: false })
  partnerCode?: string;

  @ApiProperty({ description: 'Mã đơn hàng', required: false })
  orderId?: string;

  @ApiProperty({ description: 'Request ID', required: false })
  requestId?: string;

  @ApiProperty({ description: 'Số tiền', required: false })
  amount?: string;

  @ApiProperty({ description: 'Thông tin đơn hàng', required: false })
  orderInfo?: string;

  @ApiProperty({ description: 'Loại đơn hàng', required: false })
  orderType?: string;

  @ApiProperty({ description: 'Mã giao dịch MoMo', required: false })
  transId?: string;

  @ApiProperty({ description: 'Mã kết quả (0 = success)', required: false })
  resultCode?: string;

  @ApiProperty({ description: 'Message từ MoMo', required: false })
  message?: string;

  @ApiProperty({ description: 'Hình thức thanh toán', required: false })
  payType?: string;

  @ApiProperty({ description: 'Thời gian response', required: false })
  responseTime?: string;

  @ApiProperty({ description: 'Extra data', required: false })
  extraData?: string;

  @ApiProperty({ description: 'Chữ ký để verify', required: false })
  signature?: string;
}
