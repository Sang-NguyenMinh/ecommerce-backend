import { Injectable } from '@nestjs/common';
import { CreateShoppingCartItemDto } from './dto/create-shopping-cart-item.dto';
import { UpdateShoppingCartItemDto } from './dto/update-shopping-cart-item.dto';

@Injectable()
export class ShoppingCartItemService {
  create(createShoppingCartItemDto: CreateShoppingCartItemDto) {
    return 'This action adds a new shoppingCartItem';
  }

  findAll() {
    return `This action returns all shoppingCartItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingCartItem`;
  }

  update(id: number, updateShoppingCartItemDto: UpdateShoppingCartItemDto) {
    return `This action updates a #${id} shoppingCartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCartItem`;
  }
}
