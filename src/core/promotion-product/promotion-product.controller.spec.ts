import { Test, TestingModule } from '@nestjs/testing';
import { PromotionProductController } from './promotion-product.controller';
import { PromotionProductService } from './promotion-product.service';

describe('PromotionProductController', () => {
  let controller: PromotionProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionProductController],
      providers: [PromotionProductService],
    }).compile();

    controller = module.get<PromotionProductController>(PromotionProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
