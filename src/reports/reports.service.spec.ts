import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Report } from './reports.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let fakeReportsEntity: Partial<Report>;

  beforeEach(async () => {
    fakeReportsEntity = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: fakeReportsEntity,
        }
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
