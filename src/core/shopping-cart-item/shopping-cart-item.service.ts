import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingCartItem } from './schemas/shopping-cart-item.schema';
import { Model } from 'mongoose';
import {
  CreateShoppingCartItemDto,
  UpdateShoppingCartItemDto,
} from './dto/shopping-cart-item.dto';

@Injectable()
export class ShoppingCartItemService {
  constructor(
    @InjectModel(ShoppingCartItem.name)
    private shoppingCartItemModel: Model<ShoppingCartItem>,
  ) {}

  async create(
    createShoppingCartItemDto: CreateShoppingCartItemDto,
  ): Promise<ShoppingCartItem> {
    const newCartItem = new this.shoppingCartItemModel(
      createShoppingCartItemDto,
    );
    return newCartItem.save();
  }

  async update(
    updateShoppingCartItemDto: UpdateShoppingCartItemDto,
  ): Promise<ShoppingCartItem> {
    const { id, ...updateData } = updateShoppingCartItemDto;
    const updatedCartItem = await this.shoppingCartItemModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedCartItem) {
      throw new NotFoundException('Shopping Cart Item not found');
    }
    return updatedCartItem;
  }

  async findOne(id: string): Promise<ShoppingCartItem> {
    const cartItem = await this.shoppingCartItemModel
      .findById(id)
      .populate(['cartId', 'productItemId']);
    if (!cartItem) {
      throw new NotFoundException('Shopping Cart Item not found');
    }
    return cartItem;
  }

  findAll() {
    return `This action returns all shoppingCartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCartItem`;
  }
}
