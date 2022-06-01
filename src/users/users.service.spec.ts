import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersEntity: Partial<User>;

  beforeEach(async () => {
    fakeUsersEntity = {};
    
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { 
          provide: getRepositoryToken(User), 
          useValue: fakeUsersEntity,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
