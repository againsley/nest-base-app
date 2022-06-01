import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and pw together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed res anbd the salt together and store
    const result = salt + '.' + hash.toString('hex');
    // create new user
    const user = this.usersService.create(email, result);
    ///? this.usersService.save(user);
    // return user
    return user;
  }

  async signin(email: string, password: string) {
    // Find user by email
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credentials');
    }

    return user;
  }
}
