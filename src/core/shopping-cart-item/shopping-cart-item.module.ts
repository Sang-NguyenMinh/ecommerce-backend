import { Module } from '@nestjs/common';
import { ShoppingCartItemService } from './shopping-cart-item.service';
import { ShoppingCartItemController } from './shopping-cart-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ShoppingCartItem,
  ShoppingCartItemSchema,
} from './schemas/shopping-cart-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingCartItem.name, schema: ShoppingCartItemSchema },
    ]),
  ],
  controllers: [ShoppingCartItemController],
  providers: [ShoppingCartItemService],
})
export class ShoppingCartItemModule {}
