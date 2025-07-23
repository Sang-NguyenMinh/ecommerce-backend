import { forwardRef, Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItem, ProductItemSchema } from './schemas/product-item.schema';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { ProductConfigurationModule } from '../product_configuration/product_configuration.module';
import {
  ProductConfiguration,
  ProductConfigurationSchema,
} from '../product_configuration/schemas/product_configuration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductItem.name, schema: ProductItemSchema },
      { name: ProductConfiguration.name, schema: ProductConfigurationSchema },
    ]),
    forwardRef(() => ProductConfigurationModule),
  ],
  controllers: [ProductItemController],
  providers: [ProductItemService, CloudinaryService],
})
export class ProductItemModule {}
