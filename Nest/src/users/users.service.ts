import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import * as bcrypt from 'bcrypt-nodejs';
import * as Fs from 'fs';
import { randomBytes } from 'crypto';
import * as Https from 'https';

@Injectable()
  export class UsersService {
    constructor(private prismaService: PrismaService) {}

  async updateUserPseudo(userId: any, newPseudo: string) {
      return this.prismaService.updateUser(userId, { pseudo: newPseudo });
  }

  async updateUserPass(userId: any, newPassword: string) {
    return this.prismaService.updatePass(userId, { password: newPassword});
  }

  async checkOldPass(userId: any, oldPassword: string) {
    const user = await this.prismaService.findUserById(userId);
    //console.log('passTEST1 = ', oldPassword);
    //console.log('passCONF1 = ', user.password);
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      return (1);
    }
    return (0);
  }

  async updateAvatar(file: Express.Multer.File, userId: any) {
    //const user = await this.prismaService.findUserById(userId);
    const new_img = randomBytes(16).toString('hex') + '.jpg';
    Fs.writeFile('./uploadAvatar/' + new_img, file.buffer, (err) => {if (err) {throw err;}});

    await this.prismaService.deleteAv(userId);
    await this.prismaService.updateAv(userId, { avatar: new_img});
  }

  async updateAvatarUrl(imageUrl: string, userId: any) {
      
      const img_name = randomBytes(16).toString('hex') + imageUrl.slice(imageUrl.lastIndexOf('.'));

      const file = Fs.createWriteStream("./uploadAvatar/" + img_name);
      Https.get(imageUrl, response => {
        response.pipe(file);
        file.on('finish', () => {file.close()})
      });
    await this.prismaService.updateAv(userId, {avatar: img_name});
  }

  async enableTwoFactor(userId: any, value: boolean) {
    try {
      const user = await this.prismaService.findUserById(userId);
      //console.log('User2FA is : ', user.twoFactorAuth);
      if (user.twoFactorAuth == false && value == true) {
        await this.prismaService.update2FA(userId, { twoFactorAuth: value });
      }
      else if (value == false && user.twoFactorAuth == true) {
        await this.prismaService.update2FA(userId, { twoFactorAuth: value });
        //console.log('Finish 2FA is :', user.twoFactorAuth);
      }
    } catch (error) {
      console.error('Error with enable 2FA');
    }
  }

  async validate2fa(userId: any) {
    try {
      await this.prismaService.update2FA(userId, { twofvalidated: true });
    } catch (error) {
      console.error('Error with validating 2fa');
    }
  }


  async disconnect2fa(userId: any) {
    try {
      await this.prismaService.update2FA(userId, { twofvalidated: false });
    } catch (error) {
      console.error('Error with unvalidating 2fa');
    }
  }
}


