import { Test, TestingModule } from '@nestjs/testing';
import { TesterController } from './tester.controller';

describe('TesterController', () => {
  let controller: TesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesterController],
    }).compile();

    controller = module.get<TesterController>(TesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
