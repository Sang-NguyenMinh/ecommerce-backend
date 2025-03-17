import { Module } from '@nestjs/common';
import { ProductConfigurationService } from './product_configuration.service';
import { ProductConfigurationController } from './product_configuration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductConfiguration,
  ProductConfigurationSchema,
} from './schemas/product_configuration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductConfiguration.name, schema: ProductConfigurationSchema },
    ]),
  ],
  controllers: [ProductConfigurationController],
  providers: [ProductConfigurationService],
})
export class ProductConfigurationModule {}
