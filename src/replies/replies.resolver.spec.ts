import { Test, TestingModule } from '@nestjs/testing';
import { RepliesResolver } from './replies.resolver';
import { RepliesService } from './replies.service';

describe('RepliesResolver', () => {
  let resolver: RepliesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepliesResolver, RepliesService],
    }).compile();

    resolver = module.get<RepliesResolver>(RepliesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
