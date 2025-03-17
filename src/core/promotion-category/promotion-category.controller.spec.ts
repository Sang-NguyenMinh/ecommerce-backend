import { Test, TestingModule } from '@nestjs/testing';
import { PromotionCategoryController } from './promotion-category.controller';
import { PromotionCategoryService } from './promotion-category.service';

describe('PromotionCategoryController', () => {
  let controller: PromotionCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionCategoryController],
      providers: [PromotionCategoryService],
    }).compile();

    controller = module.get<PromotionCategoryController>(PromotionCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
