import { Test, TestingModule } from '@nestjs/testing';
import { PromotionProductService } from './promotion-product.service';

describe('PromotionProductService', () => {
  let service: PromotionProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionProductService],
    }).compile();

    service = module.get<PromotionProductService>(PromotionProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
