import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentTypeService {
  create(createPaymentTypeDto: any) {
    return 'This action adds a new paymentType';
  }

  findAll() {
    return `This action returns all paymentType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentType`;
  }

  update(id: number, updatePaymentTypeDto: any) {
    return `This action updates a #${id} paymentType`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentType`;
  }
}
