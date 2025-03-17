import { Test, TestingModule } from '@nestjs/testing';
import { ShopOrderController } from './shop-order.controller';
import { ShopOrderService } from './shop-order.service';

describe('ShopOrderController', () => {
  let controller: ShopOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopOrderController],
      providers: [ShopOrderService],
    }).compile();

    controller = module.get<ShopOrderController>(ShopOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
