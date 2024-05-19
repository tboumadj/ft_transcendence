import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt-nodejs';
import * as Fs from 'fs';


const prisma = new PrismaClient();

@Injectable()
export class PrismaService extends PrismaClient{

  async createUser(password?: string, name?: string, email?: string, pseudo?: string): Promise<any> {
    //console.log('Prisma service create user');
   // console.log('mail:', email, 'user:', name, ' pass:', password);

    password = bcrypt.hashSync(password, "");
    pseudo = name + '42';

    //console.log('PassHash:', password);
    return prisma.user.create({
      data: {
        email,
        name,
        password,
        pseudo,
        avatar: 'avatardefault.jpg',
      },
    });
  }

  async create42User(password?: string, name?: string, email?: string, pseudo?: string, avatar?: string): Promise<any> {
    try {
      //console.log('primsa service create42user');
      return prisma.user.create({
        data: {
          email,
          name,
          password,
          pseudo,
          avatar,
        },
      });
    } catch (error) {
      console.error('error with new user42');
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    // console.log('Prisma Service Find');
    try {
    // if (!username) return null;
    return prisma.user.findUnique({
      where: {
        name: username,
      },
    });
    } catch (error) {
      console.error('notfind user');
      return null;
    }
  }

  async findUserById(userId: number): Promise<User | null> {
    //console.log('Prisma Service Find User By ID');
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user || null;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePass(id: number, data: Partial<User>): Promise<User> {
    //console.log('CheckPassHash: ', data.password);
    data.password = bcrypt.hashSync(data.password, "");
    //console.log('NewPassHash: ', data.password);

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateAv(id: number, data: Partial<User>): Promise<User> {
    //console.log('new_img: ', data.avatar);
    return prisma.user.update({
      where: { id },
      data, 
    });
  }

  async update2FA(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

	async deleteAv(id: number) {
		const user: User = await this.findUserById(id);
		const img_name = user.avatar;
    if (img_name == 'avatardefault.jpg') {
      return  null;
    } else {
      Fs.rm('./uploadAvatar/' + img_name, (err) => {if (err) {throw err;}});
      await this.updateAv(id, { avatar: 'avatardefault.jpg' });
    }
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
      select: {
        friends: true,
      },
    });
  if (!user) {
    throw new Error('User not found');
  }

    const isFriendAlreadyAdded = user.friends.includes(friendId);
    if (isFriendAlreadyAdded) {
      throw new Error('Friend already exists in the list');
    }

    const updatedFriends = [...user.friends, friendId];
    const friendsAsNumbers: number[] = updatedFriends.map(friend => Number(friend));

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      friends: friendsAsNumbers,
    },
  });
}

  async removeFriend(userId: number, friendId: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedFriends = user.friends.filter(id => id !== friendId);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: updatedFriends,
      },
    });
  }

  async getFriends(userId: number): Promise<number[]> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.friends;
  }

  async updateInvMess(id: number) {
    // console.log('id friend = ', id);
    return await prisma.user.update({
      where: { id },
      data: { haveMessage: true },
    });
  }
  
  async updateInvMessToFalse(id: number) {
    // console.log('id friend = ', id);
    return await prisma.user.update({
      where: { id },
      data: { haveMessage: false },
    });
  }
  async updateInvitation(id: number) {
    // console.log('id friend = ', id);
    return await prisma.user.update({
      where: { id },
      data: { haveInvitation: true },
    });
  }
  
  async updateInvitationToFalse(id: number) {
    // console.log('id friend = ', id);
    return await prisma.user.update({
      where: { id },
      data: { haveInvitation: false },
    });
  }

async updateOnLine(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { onLine: true },
    });
  }

  async updateOffLine(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { onLine: false },
    });
  }

  async updateInGame(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { inGame: true },
    });
  }

  async updateOutGame(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { inGame: false },
    });
  }

  quickFix(user: User): User {
		if (!user)
			return undefined;

		if (!(user.wins >= 0))
			user.wins = 0;
		if (!(user.lose >= 0))
			user.lose = 0;

		return user;
	}

}

