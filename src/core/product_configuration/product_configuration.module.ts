import { Module } from '@nestjs/common';
import { ProductConfigurationService } from './product_configuration.service';
import { ProductConfigurationController } from './product_configuration.controller';

@Module({
  controllers: [ProductConfigurationController],
  providers: [ProductConfigurationService],
})
export class ProductConfigurationModule {}
