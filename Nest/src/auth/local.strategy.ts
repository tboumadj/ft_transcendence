// local.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(username: string, password: string): Promise<any> {
//     console.log(`local: Searching for username: ${username}`);
//     console.log(`local: Searching for password: ${password}`);
//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       return null;
//     }
//     return user;
//   }
// }


// local.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true, // Permet de passer la requête à la fonction de validation
    });
  }

  async validate(request: any, name: string, password: string): Promise<any> {
    //console.log(`local: Searching for username: ${name}`);
    //console.log(`local: Searching for password: ${password}`);
    
    //console.log(`local: Request details: ${JSON.stringify(request)}`);

    const user = await this.authService.validateUser(name, password);
    if (!user) {
      return null;
    }
    return user;
  }
}

