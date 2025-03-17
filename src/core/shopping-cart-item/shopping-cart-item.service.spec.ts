import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartItemService } from './shopping-cart-item.service';

describe('ShoppingCartItemService', () => {
  let service: ShoppingCartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingCartItemService],
    }).compile();

    service = module.get<ShoppingCartItemService>(ShoppingCartItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
