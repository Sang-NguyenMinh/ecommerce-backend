import { Test, TestingModule } from '@nestjs/testing';
import { CategoryVariationService } from './variation.service';

describe('CategoryVariationService', () => {
  let service: CategoryVariationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryVariationService],
    }).compile();

    service = module.get<CategoryVariationService>(CategoryVariationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
