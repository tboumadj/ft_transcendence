import { Controller, Post, Put, Get, Request, UseGuards, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { Request as ExpressRequest} from 'express';
import { Express } from 'express';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';
import {ProfileService } from '../auth/profile.service';
import { AuthMiddleware } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
// import * as Fs from 'fs';
// import { randomBytes } from 'crypto';
// import * as path from 'path';
// import { diskStorage } from 'multer';
// import { extname } from 'path';


@Controller('users')
export class UsersController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async createUser(@Body() createUserDto: { password?: string; name?: string; email?: string; pseudo?: string }): Promise<any> {
    const { password, name , email, pseudo} = createUserDto;
    const newUser = await this.prismaService.createUser(password, name, email, pseudo);

    if (newUser.statusCode){
      return null;
    }
    else{
      //console.log('UserCreate= ', newUser);
      const Response = { succes: true, name };
      return Response;
    }
  }
}

@Controller('update')
  export class UpdatePController {
    constructor(private readonly usersService: UsersService,
                private prismaService: PrismaService,
                private profileService: ProfileService) {}

  @Put('addFriend')
  @UseGuards(AuthMiddleware)
  async FriendForLife(@Request() req: ExpressRequest, @Body('friend') friend: number) {
    const userId:number = +req.user;
    const friendId:number = +friend;
    //console.log('MyID= ', userId);
    //console.log('FriendID= ', friendId);
    
    await this.prismaService.addFriend(userId, friendId);

    const friends = await this.prismaService.getFriends(userId);
    //console.log(friends); 

    return { success: true , friendlist: friends};
  }

  @Put('deleteFriend')
  @UseGuards(AuthMiddleware)
  async deleteFriend(@Request() req: ExpressRequest, @Body('friend') friend: number) {
    const userId:number = +req.user;
    const friendId:number = +friend;
    //console.log('MyID= ', userId);
    //console.log('FriendID= ', friendId);

    await this.prismaService.removeFriend(userId, friendId);

    const friends = await this.prismaService.getFriends(userId);
    //console.log(friends); 

    return { success: true , friendlist: friends};
  }

  //@Get('')


  @Put('searchUser')
  @UseGuards(AuthMiddleware)
  async checkForAdd(@Request() req: ExpressRequest, @Body('friend_search') friend_search: string) {
    const userId = +req.user;
    const me = await this.prismaService.findUserById(userId);
    //console.log('Me= ', me);
    const friend = await this.prismaService.findUserByUsername(friend_search);
    //console.log('Friend_searchhh= ', friend);
    if (friend)
    {
      if (me.id !== friend.id)
      {
        //console.log('check if we are already friend');
        const userFriend = await this.profileService.getProfilePublicData(friend.id);
        return { success: true, message: 'User find' , userFriend};
      }
      else {
        //console.log('ITS ME MAN');
        return { success: false, message: 'U cant search yourself' };
      }
    }
    else {
      //console.log('User doesnt exist');
      return { success: false, message: 'User doesnt exist' };
    }
  }

  @Put('Name')
  @UseGuards(AuthMiddleware)
  async updateUserPseudo(@Request() req: ExpressRequest, @Body('pseudo') newPseudo: string) {
    const userId = (req.user);
    //console.log('USERID = ', userId);
    //console.log('NewPseudo = ', newPseudo);
    return this.usersService.updateUserPseudo(userId, newPseudo);
  }


  @Put('Pass')
  @UseGuards(AuthMiddleware)
  async updateUserPass(@Request() req: ExpressRequest, @Body('password') newPassword: string, @Body('testpass') oldPassword: string) {
    const userId = (req.user);
    //console.log('UserId = ', userId);
    //console.log('OldPass = ', oldPassword);
    //console.log('NewPass = ', newPassword);
    const resp = await this.usersService.checkOldPass(userId, oldPassword);
    if (resp === 1) {
      return this.usersService.updateUserPass(userId, newPassword);
    }
    else {
      return null;
    }
  }

  @Put('checkTwoF')
  @UseGuards(AuthMiddleware)
    async checkTwoFactor(@Request() req: ExpressRequest, @Body('value') valueTF: boolean) {
    try {
      const userId:number = +req.user;
      //console.log("value is111 :", valueTF);
      this.usersService.enableTwoFactor(userId, valueTF);
      const user = await this.prismaService.findUserById(userId);
      return { success: true , userId: userId, value2f: valueTF, valid2f: user.twofvalidated};
    } catch (error) {
      console.log('Error with check 2FA');
      return { success: false };
    }
  }

  @Get('disable2fa')
  @UseGuards(AuthMiddleware)
    async disable2fa(@Request() req: ExpressRequest) {
    try {
      const userId:number = +req.user;
      this.usersService.disconnect2fa(userId);
      const user = await this.prismaService.findUserById(userId);
      return { success: true , userId: userId, value2f: user.twoFactorAuth, valid2f: user.twofvalidated};
    } catch (error) {
      console.log('Error with check 2FA');
      return { success: false };
    }
  }

  @Post('UploadAvatar')
  @UseGuards(AuthMiddleware)
  @UseInterceptors(FileInterceptor('image'))
  updateAvatar(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5000000 }),
      new FileTypeValidator({ fileType: 'image/jpeg'})
    ]})) file: Express.Multer.File, @Request() req: ExpressRequest) {
    try {
      const userId = (req.user)
      //console.log('fileAvatar: ', file);
      this.usersService.updateAvatar(file, userId);

      return { success: true, message: 'Fichier téléchargé avec succès.' };
    } catch (error) {
      console.error('Error uploadAvatar : ', error);
    }
  }


  @Post('UploadAvatarUrl')
  @UseGuards(AuthMiddleware)
  //@UseInterceptors(FileInterceptor('image'))
  async updateAvatarUrl(@Body() body: { imageUrl: string },@Request() req:ExpressRequest) {
    try {
      // const userId = (req.user)
      // console.log('AvatarUrl: ', body.imageUrl);
      // this.usersService.updateAvatarUrl(body.imageUrl, userId);

      const userId = (req.user);
      const imageUrl = body.imageUrl;

      await this.usersService.updateAvatarUrl(imageUrl, userId);

      return { success: true, message: 'Fichier téléchargé avec succès.' };
    } catch (error) {
      console.error('Error uploadAvatarUrl : ', error);
    }
  }


  @Get('ResInv')
  @UseGuards(AuthMiddleware)
  async updateResetInvit(@Request() req: ExpressRequest) {
    const userId = (+req.user);
    //console.log('USERID = ', userId);
    //console.log('NewPseudo = ', newPseudo);
    return this.prismaService.updateInvitationToFalse(userId);
  }


  @Post('InvMess')
  @UseGuards(AuthMiddleware)
  async updateInvMessage(@Body() body: { frind_id: number }) {
    const frindId = (+body.frind_id);
    return this.prismaService.updateInvMess(frindId);
  }

  @Get('ResMess')
  @UseGuards(AuthMiddleware)
  async ResInvMessage(@Request() req: ExpressRequest) {
    const userId = (+req.user);
    return this.prismaService.updateInvMessToFalse(userId);
  }
}


