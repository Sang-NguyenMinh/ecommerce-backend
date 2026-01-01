import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Res,
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
import { Response } from 'express';
import { CreatePaymentDto, PaymentResponseDto } from './payment.dto';

@ApiTags('Payment - MoMo')
@Controller('payment')
export class PaymentController {
  constructor(private readonly momoService: MomoService) {}

  @Post('create-momo-payment')
  @ApiOperation({
    summary: 'Tạo link thanh toán MoMo',
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
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tạo payment link thành công',
    type: PaymentResponseDto,
  })
  async createPayment(
    @Body()
    body: CreatePaymentDto,
  ) {
    try {
      const { orderId, amount, orderInfo } = body;

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

      const result = await this.momoService.createPayment(
        orderId,
        amount,
        orderInfo,
      );

      if (result.resultCode === 0) {
        return {
          success: true,
          message: 'Payment link created successfully',
          payUrl: result.payUrl,
          deeplink: result.deeplink,
          qrCodeUrl: result.qrCodeUrl,
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

  @Get('momo-return')
  @Public()
  async momoReturn(@Query() query: any, @Res() res: Response) {
    const isValid = this.momoService.verifyReturnSignature(query);
    console.log('cào return', isValid);
    if (isValid) return res.redirect(`http://localhost:3000/track-order`);
  }

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
  async checkStatus(@Query('orderId') orderId: string) {
    // TODO: Query database để check status của order
    return {
      orderId,
      message: 'Check your database for order status',
    };
  }
}
