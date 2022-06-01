import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './../users.service';
import { User } from './../users.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

/**
 * Responsible for ensuring the current user is tracked
 * on the session. User id is managed by session-cookie,
 * and this middleware pulls it back out and puts it into
 * the request body when it is present. Interaction with
 * cookie session is managed by @nestjs/common/Session.
 * 
 * The user id is stored into the session on the signup 
 * and signin functions in users.controller.ts
 */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}
