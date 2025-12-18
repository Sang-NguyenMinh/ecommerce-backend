import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class MomoService {
  private readonly partnerCode = 'MOMOBKUN20180529';
  private readonly accessKey = 'klm05TvNBzhg7h7j';
  private readonly secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
  private readonly endpoint =
    'https://test-payment.momo.vn/v2/gateway/api/create';
  private readonly redirectUrl = 'http://localhost:3000/payment/momo-return';
  private readonly ipnUrl = 'http://localhost:3000/payment/momo-ipn';

  /**
   * Tạo payment request với MoMo
   */
  async createPayment(orderId: string, amount: number, orderInfo: string) {
    const requestId = orderId;
    const requestType = 'captureWallet';
    const extraData = ''; // Có thể thêm data tùy chỉnh

    // Tạo raw signature
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Tạo signature bằng HMAC SHA256
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    // Request body gửi đến MoMo
    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    };

    try {
      const response = await axios.post(this.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`MoMo API Error: ${error.message}`);
    }
  }

  /**
   * Verify signature từ MoMo callback
   */
  verifySignature(data: any): boolean {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = data;

    // Tạo raw signature để verify
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Tạo signature để so sánh
    const generatedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    return signature === generatedSignature;
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  checkTransactionStatus(resultCode: string): {
    success: boolean;
    message: string;
  } {
    const statusMap = {
      '0': { success: true, message: 'Thanh toán thành công' },
      '9000': { success: true, message: 'Giao dịch được xác nhận thành công' },
      '1000': {
        success: false,
        message:
          'Giao dịch đã được khởi tạo, chờ người dùng xác nhận thanh toán',
      },
      '1001': {
        success: false,
        message: 'Giao dịch thất bại do tài khoản không đủ tiền',
      },
      '1002': {
        success: false,
        message: 'Giao dịch bị từ chối bởi nhà phát hành',
      },
      '1003': { success: false, message: 'Mã OTP không hợp lệ' },
      '1004': {
        success: false,
        message: 'Giao dịch bị từ chối do vượt quá số lần nhập OTP',
      },
      '1005': {
        success: false,
        message: 'Giao dịch bị từ chối do OTP hết hạn',
      },
      '1006': {
        success: false,
        message: 'Giao dịch bị từ chối do người dùng hủy',
      },
      '1007': { success: false, message: 'Giao dịch bị từ chối vì lý do khác' },
      '2001': {
        success: false,
        message: 'Giao dịch thất bại do sai thông tin',
      },
      '3001': { success: false, message: 'Liên kết thanh toán không hợp lệ' },
      '3002': { success: false, message: 'Liên kết thanh toán đã hết hạn' },
      '3003': { success: false, message: 'Liên kết thanh toán không tồn tại' },
      '3004': { success: false, message: 'Số tiền thanh toán không hợp lệ' },
    };

    return (
      statusMap[resultCode] || {
        success: false,
        message: 'Lỗi không xác định',
      }
    );
  }
}
