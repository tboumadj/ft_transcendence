import { Injectable, NestMiddleware } from "@nestjs/common";
//import { Response, NextFunction } from 'express';

@Injectable()
export class TwofMiddleware implements NestMiddleware {

  async use(user: any) {
    try {
      if (user.twoFactorAuth == false) {
        //next();
        return true;
      }
      else if (user.twoFactorAuth == true) {
        if (user.twofvalidated == true) {
          //next();
          return true;
        }
        else {
          //console.log('GO TO 2FA APP!!!!!!');
          return false;
        }
      }

      return true;
      //next();
    } catch (error) {
      //res.status(500).json({ message: 'Error with verified 2FA.'});
      console.error('Error with verified 2FA');
    }
  }
}
