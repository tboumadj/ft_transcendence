// auth.controller.ts
import { Controller, Post, Get, Request, UnauthorizedException, Res, UseGuards, Redirect } from '@nestjs/common';
let UID42 = process.env["UID42"];
let PROFILE42 = process.env["PROFILE42"];
let SECRET42 = process.env["SECRET42"];
import * as otplib from 'otplib';
//import * as jwt from 'jsonwebtoken';
//import { AuthGuard } from '@nestjs/passport';

import { Request as ExpressRequest, Response } from 'express';
//import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/users/prisma.service';
import { AuthMiddleware } from './jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UsersService } from 'src/users/users.service';
import { config } from 'dotenv';
config();
//import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
    private usersService: UsersService) {}

  // @Get('local-ip')
  // getLocalIp(): string {
  //   return process.env.LOCAL_IP || "localhost";
  // }

  @Post('login')
  async login(@Request() req: ExpressRequest) {
    const { name, password } = req.body;

    //console.log('body is: ', req.body);
    if ( !name || !password ) {
      throw new UnauthorizedException('Missing Credentials!');
    }
    const user = await this.authService.validateUser(name, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //console.log(`User logged in - Username: ${user.name}`);
    return this.authService.login(user);
  }

  @Post('trustlogin')
  async trustlogin(@Request() req:ExpressRequest) {
    //try {
      const userId: number = +req.body.userId;
      //console.log('BODY IS: ', userId);

      const user = await this.prismaService.findUserById(userId);
      //console.log('userIS: ', user);
      return this.authService.login(user);
    //} catch (error) {
    //  console.log('cannot login trust User');
    //}
  }

  @Get('2FAdir')
  async generate2FA(@Request()req: any) {
    const userId  = req.query.userId;
    const id: number = +userId;
    //console.log('UserId2FA dir: ', userId);

    const secret = otplib.authenticator.generateSecret();
    //console.log('secret = ', secret);
    const user = await this.prismaService.findUserById(id);
    //console.log('user = ', user.name);
    await this.prismaService.update2FA(id, { twofsecret: secret });


    const uri = otplib.authenticator.keyuri(user.name, 'Trispong', secret);


    //console.log('URI for Google Authenticator:', uri);
    
    return { success: true, userId: id , uri: uri};
    //res.type('text/html').send(this.authService.getSuccess2fa(JSON.stringify(userId), uri));
  }

  @Get('verify2fa')
  async verify2fa(@Request()req: any) {
    const userId:number = +req.query.userId;
    const testCode = req.query.code;
    //console.log('UserID verify = ', userId);
    //console.log('TestCode = ', testCode);

    const user = await this.prismaService.findUserById(userId);
    //console.log('userID2fa= ', user);
    //console.log('TestCodeUser= ', user.twofsecret);

    const serverGeneratedCode = otplib.authenticator.generate(user.twofsecret);

    if (testCode === serverGeneratedCode) {
      console.log('Authentification à deux facteurs réussie');
      await this.usersService.validate2fa(userId);
      return { success: true , userId: userId, valid2fa: user.twofvalidated};
    } else {
      console.log('Échec de l\'authentification à deux facteurs');
      return {success: false };
    }
    //return null;
  }

  @Get('42login')
  @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c2e8bc52e0fa0828fe21bdc65d9737036e07bd1c9f7af2fd6a26828eb613d764&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2FfetchProfile42&response_type=code')
  //@Redirect('https://api.intra.42.fr/oauth/authorize?client_id=' + UID42 + '&redirect_uri=' + PROFILE42 + '&response_type=code', 301)
  notuUsedFunc() {}

  @Get('fetchProfile42')
  async fetchProfile42(@Request()req: any, @Res() res: any) {
    //console.log("test env:", UID42);
    //console.log("test env return:", PROFILE42);
    const access_token = await this.authService.getAccesToken42(req.query.code);
    const user42 = await this.authService.fetchInfo42(access_token);
    //console.log('USER42, ',user42);
    //console.log('return acces=', access_token);
    //console.log('user42: ', user42.login);

    const search = await this.prismaService.findUserByUsername(user42.login);
    //console.log("search: ", search);
    if (!search) {
      //console.log('go to create 42user');
      const newUser = await this.authService.createUser42(user42);
      const resp = await this.authService.login(newUser);
      //console.log('Resp: ', resp);
      if (resp.success == false) {
        //console.log('je sort iciiiiii');
        res.type('text/html').send(this.authService.getError(JSON.stringify(resp.userId)));
      }
      res.type('text/html').send(this.authService.getSuccess(JSON.stringify(resp.success),resp.token));
    } else {
      //console.log('go to else');
      const resp2 = await this.authService.login(search);
      if (resp2.success == false) {
        //console.log('Jesuislaaaaaa');
        res.type('text/html').send(this.authService.getError(JSON.stringify(resp2.userId)));
      }
      else {
        res.type('text/html').send(this.authService.getSuccess(JSON.stringify(resp2.success),resp2.token));
      }
    }
  }
}

@Controller('auth/checkJWT')
export class JwtController {
  @Get()
  @UseGuards(AuthMiddleware)
    async getResource(@Request() req: ExpressRequest) {
      //console.log('CHECK9:', req.user);
      return { token: req.user , success : true};
    }
}

@Controller('auth/profile')
export class ProfileController {
  constructor(private readonly profileService : ProfileService) {}
  @Get()
  @UseGuards(AuthMiddleware)
    async getProfile(@Request() req: ExpressRequest) {
    try {
      const userId = (req.user);
      //console.log('req.user: ', req.user);
      //console.log('userID: ', userId);

      if (!userId) {
        throw new Error('ID utilisateur non défini dans la requête');
      }

      const profileData = this.profileService.getProfileData(userId);
      return profileData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil', error);
      throw new Error('Erreur lors de la récupération des données du profil');
    }
  }

  @Get('/friend')
  @UseGuards(AuthMiddleware)
    async getProfilePublic(@Request() req: any) {
    try {
      const userId = (req.user);
      const FriendId:number = +req.query.userId;

      if (!userId) {
        throw new Error('ID utilisateur non défini dans la requête');
      }

      const profileData = this.profileService.getProfilePublicData(FriendId);
      return profileData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil', error);
      throw new Error('Erreur lors de la récupération des données du profil');
    }
  }

  @Get('/invit')
  @UseGuards(AuthMiddleware)
    async getInvit(@Request() req: any) {
    try {
      const userId = (req.user);
      if (!userId) {
        throw new Error('ID utilisateur non défini dans la requête');
      }

      const profileData = this.profileService.getProfilInvit(userId);
      return profileData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil', error);
      throw new Error('Erreur lors de la récupération des données du profil');
    }
  }
  
  @Get('/message')
  @UseGuards(AuthMiddleware)
    async getMess(@Request() req: any) {
    try {
      const userId = (req.user);
      if (!userId) {
        throw new Error('ID utilisateur non défini dans la requête');
      }

      const profileData = this.profileService.getProfilMessage(userId);
      return profileData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil', error);
      throw new Error('Erreur lors de la récupération des données du profil');
    }
  }

  @Get('/friendlist')
  @UseGuards(AuthMiddleware)
    async getProfileFriend(@Request() req:any) {
      try {
        const userId = +req.user;

        if (!userId) {
          throw new Error('ID not defined');
        }
      const result = await this.profileService.getProfileFriend(userId);
      let user: any[] = [];
      for (let i = 0; i < result.length; i++) {
        const profile = await this.profileService.getProfileList(result[i]);
        user.push(profile);
      }
        return user;

      } catch (error) {
        console.error('erreur lors de la friendlist');
      }
    }


}
