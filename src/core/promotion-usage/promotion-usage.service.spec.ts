import { Test, TestingModule } from '@nestjs/testing';
import { PromotionUsageService } from './promotion-usage.service';

describe('PromotionUsageService', () => {
  let service: PromotionUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionUsageService],
    }).compile();

    service = module.get<PromotionUsageService>(PromotionUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
