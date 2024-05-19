import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const str: string = req.header('Authorization');
      //console.log('check1: ', str);
      const test = str.split(' ');
      const jwt = test[1];
      //console.log('check2: ', jwt);
      const secret = 'boumboum';
      const jeton = require('jsonwebtoken');
      const decoded = jeton.verify(jwt, secret);
      //console.log('decode: ', decoded);
      //console.log('decoded:sub: ', decoded.sub);
      //req. = decoded.sub;
      req.user = decoded.sub;
      // if (req.user) {
      //   const user = await this.jwtStrategy.validate(req.user);
      //   console.log('check3:', user);
      //   req.user = user;
      // }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token invalid or expired.' });
    }
  }
}
