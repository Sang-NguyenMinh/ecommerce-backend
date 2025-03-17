import { Injectable } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';

@Injectable()
export class OrderLineService {
  create(createOrderLineDto: CreateOrderLineDto) {
    return 'This action adds a new orderLine';
  }

  findAll() {
    return `This action returns all orderLine`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLine`;
  }

  update(id: number, updateOrderLineDto: UpdateOrderLineDto) {
    return `This action updates a #${id} orderLine`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
