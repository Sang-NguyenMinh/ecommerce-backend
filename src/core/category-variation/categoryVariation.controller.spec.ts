import { Test, TestingModule } from '@nestjs/testing';
import { CategoryVariationController } from './categoryVariation.controller';
import { CategoryVariationService } from './categoryVariation.service';

describe('VariationController', () => {
  let controller: CategoryVariationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryVariationController],
      providers: [CategoryVariationService],
    }).compile();

    controller = module.get<CategoryVariationController>(
      CategoryVariationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
