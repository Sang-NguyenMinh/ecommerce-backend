import { Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';

@Module({
  controllers: [ProductItemController],
  providers: [ProductItemService],
})
export class ProductItemModule {}
