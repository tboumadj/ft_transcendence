// auth.service.ts
import { Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../users/prisma.service';
import * as bcrypt from 'bcrypt-nodejs';
import * as Fs from 'fs';
import { randomBytes } from 'crypto';
import * as Https from 'https';
import { TwofMiddleware } from './twof-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly myTwoFmiddle: TwofMiddleware,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    //console.log(`Searching for user with username: ${name}`);
    const user = await this.prismaService.findUserByUsername(name);
    //console.log('user of service auth: ', user);
    //console.log('pass:', password);
    //console.log('userpass:', user.password);
    //user.password = bcrypt.hashSync(user.password,"");
    //console.log('userpassBcrypt:', user.password);
    //console.log('fonc:', bcrypt.compareSync(password, user.password));
    if (user && bcrypt.compareSync(password, user.password)) { 
    const { password, ...result } = user;
      return result;
    }
    //return user;
    return null;
  }

  async login(user: any) {
    //console.log('user: ', user);
    const check = await this.myTwoFmiddle.use(user);
    const payload = { name: user.name, sub: user.id };
    if (check == false) {
      console.log('Falselogin');
      return {
        success: false,
        message: '2FA needed',
        userId : user.id,
      }
    }
    else if (check == true) {
      //console.log('payload: ', payload);
      //console.log('payload sign: ', this.jwtService.sign(payload),)
      return {
        success: true,
        token: this.jwtService.sign(payload),
      };
    }
  }

  async getAccesToken42(code: string) {
    try {
      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          client_id: 'u-s4t2ud-c2e8bc52e0fa0828fe21bdc65d9737036e07bd1c9f7af2fd6a26828eb613d764',
          client_secret: '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',
          redirect_uri: 'http://localhost:3000/api/auth/fetchProfile42',
          grant_type: 'authorization_code',
        }),
      });

      const responseData = await response.json(); 
      return responseData.access_token;
    } catch (error) {
      console.log("error fetch user data..");
    }
  }


  async fetchInfo42(token: string) {
    try {
      const auth_header = "Bearer " + token;
      const req_user = await fetch("https://api.intra.42.fr/v2/me", {
        method: "GET",
        headers: {
          "Authorization": auth_header,
        }})

      return (req_user.json());
    } catch (error) {
      console.log('erreur with fetch info user42');
    }
  }

  async createUser42(user42: any) {
    try {
      const img_name = randomBytes(16).toString('hex') + user42.image.link.slice(user42.image.link.lastIndexOf('.'));

      const password = bcrypt.hashSync("user42password", "");
      const pseudo = user42.login + "#42";
      //const username = user42.login;

      const file = Fs.createWriteStream("./uploadAvatar/" + img_name);
      Https.get(user42.image.link, response => {
        response.pipe(file);
        file.on('finish', () => {file.close()})
      });

      //console.log('img42: ', img_name);
      //console.log('mail42: ', user42.email);
      //console.log('file42: ', file);
      //console.log('username42: ', username);
      //console.log('pseudo42: ', pseudo);
      //console.log('password42: ', password);

      const newUser = await this.prismaService.create42User(password, user42.login, user42.email, pseudo, img_name);
      //console.log("newUser42 = ", newUser);
      return newUser;
    } catch (error) {
      console.log("error with create user42");
    }
  }

  getSuccess(user: string, jwt: string): string {
    return `<script>
              window.opener.postMessage({ 
              type: '42auth-success', 
              user: JSON.stringify(${user}),
              jwt: '${jwt}'    
                    }, '*');
                </script>`
  }

  getError(user: any): string {
    return `<script>
              window.opener.postMessage({ 
              type: '42auth-false', 
              user: JSON.stringify(${user}),
                    }, '*');
                </script>`
  }
  getSuccess2fa(user:any, uri: string): string{
    return `<script>
              window.opener.postMessage({ 
              type: '2faAuth-success', 
              user: JSON.stringify(${user}),
              uri: '${uri}'    
                    }, '*');
                </script>`
  }

}


