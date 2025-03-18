import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCart } from './schemas/shopping-cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateShoppingCartDto,
  UpdateShoppingCartDto,
} from './dto/shopping-cart.dto';

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
  findAll() {
    return `This action returns all shoppingCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCart`;
  }
}
