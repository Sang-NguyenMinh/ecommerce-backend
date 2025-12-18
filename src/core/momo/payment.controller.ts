import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MomoService } from './payment.service';
import { Public } from 'src/decorators/customize';

// DTOs cho Swagger
class CreatePaymentDto {
  orderId: string;
  amount: number;
  orderInfo: string;
}

class PaymentResponseDto {
  success: boolean;
  message: string;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

@ApiTags('Payment - MoMo')
@Controller('payment')
export class PaymentController {
  constructor(private readonly momoService: MomoService) {}

  /**
   * API tạo link thanh toán
   */
  @Post('create-momo-payment')
  @ApiOperation({
    summary: 'Tạo link thanh toán MoMo',
    description:
      'Tạo link thanh toán và nhận về payUrl để redirect user đến trang thanh toán MoMo',
  })
  @Public()
  @ApiBody({
    type: CreatePaymentDto,
    examples: {
      example1: {
        summary: 'Đơn hàng thường',
        value: {
          orderId: 'ORDER_' + Date.now(),
          amount: 50000,
          orderInfo: 'Thanh toán đơn hàng #123',
        },
      },
      example2: {
        summary: 'Nạp tiền',
        value: {
          orderId: 'TOPUP_' + Date.now(),
          amount: 100000,
          orderInfo: 'Nạp tiền vào tài khoản',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tạo payment link thành công',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  async createPayment(
    @Body()
    body: CreatePaymentDto,
  ) {
    try {
      const { orderId, amount, orderInfo } = body;

      // Validate input
      if (!orderId || !amount || !orderInfo) {
        throw new HttpException(
          'Missing required fields: orderId, amount, orderInfo',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (amount < 1000 || amount > 50000000) {
        throw new HttpException(
          'Amount must be between 1,000 and 50,000,000 VND',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Tạo payment request
      const result = await this.momoService.createPayment(
        orderId,
        amount,
        orderInfo,
      );

      // result.resultCode = 0 nghĩa là tạo thành công
      if (result.resultCode === 0) {
        return {
          success: true,
          message: 'Payment link created successfully',
          payUrl: result.payUrl, // URL để redirect user đến trang thanh toán MoMo
          deeplink: result.deeplink, // Deep link để mở app MoMo
          qrCodeUrl: result.qrCodeUrl, // QR code để scan
        };
      } else {
        throw new HttpException(
          result.message || 'Failed to create payment',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Callback URL - MoMo redirect user về đây sau khi thanh toán
   */
  @Get('momo-return')
  @ApiOperation({
    summary: 'Callback URL cho MoMo',
    description:
      'URL này được MoMo gọi sau khi user hoàn thành thanh toán (redirect từ trang MoMo về)',
  })
  @ApiQuery({
    name: 'partnerCode',
    required: false,
    description: 'Partner code từ MoMo',
  })
  @ApiQuery({ name: 'orderId', required: false, description: 'Mã đơn hàng' })
  @ApiQuery({ name: 'requestId', required: false, description: 'Request ID' })
  @ApiQuery({ name: 'amount', required: false, description: 'Số tiền' })
  @ApiQuery({
    name: 'orderInfo',
    required: false,
    description: 'Thông tin đơn hàng',
  })
  @ApiQuery({
    name: 'orderType',
    required: false,
    description: 'Loại đơn hàng',
  })
  @ApiQuery({
    name: 'transId',
    required: false,
    description: 'Mã giao dịch MoMo',
  })
  @ApiQuery({
    name: 'resultCode',
    required: false,
    description: 'Mã kết quả: 0=success',
  })
  @ApiQuery({
    name: 'message',
    required: false,
    description: 'Message từ MoMo',
  })
  @ApiQuery({
    name: 'payType',
    required: false,
    description: 'Hình thức thanh toán',
  })
  @ApiQuery({
    name: 'responseTime',
    required: false,
    description: 'Thời gian response',
  })
  @ApiQuery({ name: 'extraData', required: false, description: 'Extra data' })
  @ApiQuery({
    name: 'signature',
    required: false,
    description: 'Chữ ký để verify',
  })
  @ApiResponse({
    status: 200,
    description: 'Xử lý callback thành công',
  })
  async momoReturn(@Query() query: any) {
    try {
      // Verify signature
      const isValid = this.momoService.verifySignature(query);

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid signature',
        };
      }

      // Check transaction status
      const status = this.momoService.checkTransactionStatus(query.resultCode);

      // TODO: Cập nhật database với kết quả thanh toán
      console.log('Payment result:', {
        orderId: query.orderId,
        transId: query.transId,
        amount: query.amount,
        status: status,
      });

      // Redirect user đến trang success/failure
      if (status.success) {
        // return `<script>window.location.href='http://localhost:4200/payment-success?orderId=${query.orderId}'</script>`;
        return {
          success: true,
          message: status.message,
          orderId: query.orderId,
          transId: query.transId,
          amount: query.amount,
        };
      } else {
        return {
          success: false,
          message: status.message,
          orderId: query.orderId,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Error processing payment return',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * IPN URL - MoMo gọi API này để thông báo kết quả thanh toán (server-to-server)
   */
  @Post('momo-ipn')
  @ApiOperation({
    summary: 'IPN URL cho MoMo (server-to-server)',
    description:
      'URL này được MoMo gọi trực tiếp từ server để thông báo kết quả thanh toán. Phải public và accessible từ internet.',
  })
  @ApiResponse({
    status: 200,
    description: 'IPN received',
  })
  async momoIPN(@Body() body: any) {
    try {
      // Verify signature
      const isValid = this.momoService.verifySignature(body);

      if (!isValid) {
        return {
          resultCode: 1,
          message: 'Invalid signature',
        };
      }

      // Check transaction status
      const status = this.momoService.checkTransactionStatus(body.resultCode);

      // TODO: Cập nhật database
      // - Lưu thông tin giao dịch
      // - Cập nhật trạng thái đơn hàng
      // - Gửi email/notification cho user
      console.log('IPN received:', {
        orderId: body.orderId,
        transId: body.transId,
        amount: body.amount,
        status: status,
      });

      // Phải trả về response cho MoMo biết đã nhận được IPN
      return {
        resultCode: 0,
        message: 'Success',
      };
    } catch (error) {
      return {
        resultCode: 1,
        message: error.message,
      };
    }
  }

  /**
   * API kiểm tra trạng thái giao dịch (optional)
   */
  @Get('check-status/:orderId')
  @ApiOperation({
    summary: 'Kiểm tra trạng thái giao dịch',
    description: 'Check trạng thái thanh toán của một order',
  })
  @ApiQuery({
    name: 'orderId',
    required: true,
    description: 'Mã đơn hàng cần check',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về status của order',
  })
  async checkStatus(@Query('orderId') orderId: string) {
    // TODO: Query database để check status của order
    return {
      orderId,
      message: 'Check your database for order status',
    };
  }
}
