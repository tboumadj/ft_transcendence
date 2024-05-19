//profile.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/users/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async getProfileData(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }

      const profileData = {
        id: user.id,
        username: user.name,
        email: user.email,
        pseudo: user.pseudo,
        avatar: user.avatar,
        twoFactorAuth: user.twoFactorAuth,
        twofvalidated: user.twofvalidated,
        friends: user.friends,
      };
      //console.log('AvatarProfile: ', user.avatar);
      //console.log('2FAProfile: ', user.twoFactorAuth);
      //console.log('2FAvalidated: ', user.twofvalidated);
      return profileData;
    } catch (error) {
      console.error('Error for profile data');
      throw new Error('Error for profile data');
    }
  }

  async getProfilInvit(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }
      // console.log('user = ', user);
      if(user.haveInvitation === true) {
        return true;
      }
      else {
        return false;
      }
    } catch(error) {
      console.error('Cannot look my invitation', error);
    }
  }
  
  async getProfilMessage(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }
      // console.log('user = ', user);
      if(user.haveMessage === true) {
        return true;
      }
      else {
        return false;
      }
    } catch(error) {
      console.error('Cannot look my invitation', error);
    }
  }
  
  async getProfilePublicData(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }

      const profileData = {
        id: user.id,
        username: user.name,
        email: user.email,
        pseudo: user.pseudo,
        avatar: user.avatar,
        friends: user.friends,
      };
      //console.log('AvatarProfile: ', user.avatar);
      //console.log('2FAProfile: ', user.twoFactorAuth);
      //console.log('2FAvalidated: ', user.twofvalidated);
      return profileData;
    } catch (error) {
      console.error('Error for profile data');
      throw new Error('Error for profile data');
    }
  }

  async getProfileFriend(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }

      const result = user.friends;
      return result;

    } catch (error) {
      console.error('error for profile data');
    }
  }


  async getProfileList(userId: any) {
    try {
      const user = await this.prismaService.findUserById(userId);
      if (!user) {
        return null;
      }

      const profileData = {
        id: user.id,
        username: user.name,
        pseudo: user.pseudo,
        avatar: user.avatar,
      };
      return profileData;
    } catch (error) {
      console.error('Error for profile data');
      throw new Error('Error for profile data');
    }
  }



}
