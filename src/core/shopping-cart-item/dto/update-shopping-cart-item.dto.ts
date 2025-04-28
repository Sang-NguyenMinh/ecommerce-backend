import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingCartItemDto } from './create-shopping-cart-item.dto';

export class UpdateShoppingCartItemDto extends PartialType(CreateShoppingCartItemDto) {}
