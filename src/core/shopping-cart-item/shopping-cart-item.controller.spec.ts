import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartItemController } from './shopping-cart-item.controller';
import { ShoppingCartItemService } from './shopping-cart-item.service';

describe('ShoppingCartItemController', () => {
  let controller: ShoppingCartItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingCartItemController],
      providers: [ShoppingCartItemService],
    }).compile();

    controller = module.get<ShoppingCartItemController>(ShoppingCartItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
