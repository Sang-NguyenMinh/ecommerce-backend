import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionProductDto } from './create-promotion-product.dto';

export class UpdatePromotionProductDto extends PartialType(CreatePromotionProductDto) {}
