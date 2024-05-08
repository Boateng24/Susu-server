import { Test, TestingModule } from '@nestjs/testing';
import { ResetpasswordService } from './resetpassword.service';

describe('ResetpasswordService', () => {
  let service: ResetpasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetpasswordService],
    }).compile();

    service = module.get<ResetpasswordService>(ResetpasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
