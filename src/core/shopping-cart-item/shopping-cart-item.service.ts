import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingCartItem } from './schemas/shopping-cart-item.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CreateShoppingCartItemDto,
  UpdateShoppingCartItemDto,
} from './dto/shopping-cart-item.dto';
import { CustomOptions } from 'src/config/types';

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

  async findAll(
    filter?: FilterQuery<ShoppingCartItem>,
    options?: CustomOptions<ShoppingCartItem>,
  ): Promise<{ cartItems: ShoppingCartItem[]; total: number }> {
    const total = await this.shoppingCartItemModel.countDocuments({
      ...filter,
    });

    const cartItems = await this.shoppingCartItemModel
      .find({ ...filter }, { ...options })
      .populate(['cartId', 'productItemId'])
      .exec();

    return {
      cartItems,
      total,
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.shoppingCartItemModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Shopping Cart Item with id ${id} not found`);
    }
  }
}
