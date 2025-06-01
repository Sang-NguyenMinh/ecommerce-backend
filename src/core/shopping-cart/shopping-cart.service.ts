import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCart } from './schemas/shopping-cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  CreateShoppingCartDto,
  UpdateShoppingCartDto,
} from './dto/shopping-cart.dto';
import { CustomOptions } from 'src/config/types';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private shoppingCartModel: Model<ShoppingCart>,
  ) {}

  async create(
    createShoppingCartDto: CreateShoppingCartDto,
  ): Promise<ShoppingCart> {
    const newCart = new this.shoppingCartModel(createShoppingCartDto);
    return newCart.save();
  }

  async update(
    updateShoppingCartDto: UpdateShoppingCartDto,
  ): Promise<ShoppingCart> {
    const { id, ...updateData } = updateShoppingCartDto;
    const updatedCart = await this.shoppingCartModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedCart) {
      throw new NotFoundException('Shopping Cart not found');
    }
    return updatedCart;
  }

  async findOne(id: string): Promise<ShoppingCart> {
    const cart = await this.shoppingCartModel.findById(id).populate('userId');
    if (!cart) {
      throw new NotFoundException('Shopping Cart not found');
    }
    return cart;
  }
  async findAll(
    filter?: FilterQuery<ShoppingCart>,
    options?: CustomOptions<ShoppingCart>,
  ): Promise<{ shoppingCarts: ShoppingCart[]; total: number }> {
    const total = await this.shoppingCartModel.countDocuments({ ...filter });

    const shoppingCarts = await this.shoppingCartModel
      .find({ ...filter }, { ...options })
      .populate('userId')
      .exec();

    return {
      shoppingCarts,
      total,
    };
  }

  async remove(id: string) {
    const deletedCart = await this.shoppingCartModel.findByIdAndDelete(id);
    if (!deletedCart) {
      throw new NotFoundException('Shopping Cart not found');
    }
    return deletedCart;
  }
}
