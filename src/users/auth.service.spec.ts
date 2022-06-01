import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { async } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed pw', async () => {
    const user = await service.signup('test@test.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error if signup with in use email', (done) => {
    service.signup('test@test.com', 'password').then(() => {
      service.signup('test@test.com', 'password').catch((err) => {
        expect(err.message).toEqual('email in use');
        expect(err.status).toEqual(400);
        done();
      });
    });
  });

  it('throws if signin called with unused email', (done) => {
    service.signin('test@test.com', 'asdf').catch((err) => {
      done();
    });
  });

  it('throws if signin called with invalid pw', (done) => {
    service.signup('test@test.com', 'password').then(() => {
      service.signin('test@test.com', 'wrongpassword').catch((err) => {
        console.log('error', err.message, err.status);
        expect(err.message).toEqual('invalid credentials');
        expect(err.status).toEqual(400);
        done();
      });
    });
  });

  it('returns a user if correct pw provided', async () => {
    await service.signup('test@test.com', 'password');
    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });
});
