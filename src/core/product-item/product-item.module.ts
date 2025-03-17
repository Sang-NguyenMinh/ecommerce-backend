import { Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItem, ProductItemSchema } from './schemas/product-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
  ],
  controllers: [ProductItemController],
  providers: [ProductItemService],
})
export class ProductItemModule {}
