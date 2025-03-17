import { Module } from '@nestjs/common';
import { ShoppingCartItemService } from './shopping-cart-item.service';
import { ShoppingCartItemController } from './shopping-cart-item.controller';

@Module({
  controllers: [ShoppingCartItemController],
  providers: [ShoppingCartItemService],
})
export class ShoppingCartItemModule {}
