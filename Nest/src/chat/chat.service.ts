import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ChannelDto, EventChannelDto, FullChannelDto, MessageDto } from './dto/chat.dto';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import { GroupeEntity } from './entity/chat.entity';
import { plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Request as ExpressRequest } from 'express';
import { group } from 'console';

@Injectable()
export class ChatService {

	private clients : Map<string, string>;	

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService ) {
		this.clients = new Map<string, string>;
	}

	async handleconnection(client: Socket) {
    try {
		const user = await this.getUserSocket(client);
		const channel = await this.prisma.groupes.findMany();
		this.clients.set(user.name, client.id);
		for (let i = 0; i < channel.length ; i++) {
			if (channel[i].members.includes(user.id)) {
				console.log(channel[i].id.toString());
			}
		}
	} catch (error) {
      console.error('Error handleConnection chat');
    }
  }

	async handledisconnect(client: Socket) {
		client.disconnect();
	}

	async messagesChannel(channel: string, req: Request) {
		try {
			//console.log("THIS");
			//console.log("THIS");
			//console.log("THIS");
			const username = await this.getUsernameJwt(req)
			const user = await this.prisma.user.findUnique({where: {name: username}})
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: channel}});
			//console.log("THIS", groupe);
			if (groupe.members.includes(user.id))
				return await this.prisma.messages.findMany({where: {receiver: groupe.id}});
		} catch (error) {

		}
	}

	async myChannels(client: Socket) {
		const user = await this.getUserSocket(client);
		if (!user)
			throw ("userNotAuthorized");
		const all_channels : GroupeEntity[] = plainToClass(GroupeEntity, await this.prisma.groupes.findMany());
		let grps = [];
		let joined = [];
		for (let i = 0; i < all_channels.length; i++) {
			if (all_channels[i].members.includes(user.id)) {
				if (all_channels[i].private_message) {
					const users = all_channels[i].channel_name.split("$");
					if (users[1] == user.name)
						all_channels[i].displayName = users[2];
					else
						all_channels[i].displayName = users[1];
				}
				else
					all_channels[i].displayName = all_channels[i].channel_name;
				grps.push(all_channels[i]);
				joined.push(all_channels[i].id.toString());
			}
		}
		return [client.id, {status: "GET", data: grps}];
	}
	async usersChannel(channel: string, req : Request) {
		try {
			const username = await this.getUsernameJwt(req)
      
			const user = await this.prisma.user.findUnique({where: {name: username}});
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: channel}});
			if (!groupe.members.includes(user.id))
				 throw "NotAuthorized";
			const groupeUsers = await this.prisma.user.findMany({where: {
				id: {in: groupe.members
				}}, 
				select: {
					id: true,
					name: true,
					pseudo: true,
					avatar: true,
			}});
			return groupeUsers;	
		} catch (error) {
			return error;
		}

	}

	async informationChannel(channel: string, req: Request) {
		try {
			const username = await this.getUsernameJwt(req)
			const user = await this.prisma.user.findUnique({where: {name: username}});
			let groupe = await this.prisma.groupes.findUnique({where: {channel_name: channel}});
			await this.prisma.user.findMany({where: {id: { in: groupe.members}}});
			if (!groupe || !groupe.members.includes(user.id))
			throw ("userNotAuthorized");
			return (plainToClass(GroupeEntity, groupe));
		} catch (error) {
			return error;
		}
	}

	async handlechannel(event: string, client : Socket, dto: FullChannelDto) {
		try {
			switch (event) {
				case "CREATE":
					return await this.createChannel(client, dto);
				case "MODIFY":
					return await this.modifyChannel(client, dto);
				case "DELETE":
					return await this.deleteChannel(client, dto.id);
				case "PRIVATE":
					return await this.privateChannel(client, dto);
				case "GET":
					return await this.myChannels(client);
				default:
					throw "";
			}
		} catch (error) {
			return [client.id.toString(), {status: "ERROR", data:error as string}];
		}
	}

	async createChannel(client : Socket, dto: ChannelDto) {
		const user = await this.getUserSocket(client);
		const groupeExist = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
		if (dto.channel_name[0] == "$")
			throw "$ : first char is not authorized";
		if (groupeExist)
			throw "groupe already exist";
		const body = {status: "CREATE", data: plainToClass(GroupeEntity, await this.prisma.groupes.create({data: {
			channel_name: dto.channel_name,
			password: this.getPassword(dto.password),
			private_groupe: dto.private_groupe,
			private_message: false,
			owner: user.id,
			admin: [user.id],
			members: [user.id]
		}}))};
		body.data.displayName = body.data.channel_name;
		client.join(body.data.id.toString());
		return [client.id.toString(), body as any];
	} 

	async modifyChannel(client: Socket, dto: FullChannelDto) {
		const user = await this.getUserSocket(client);
		const find_groupe = await this.prisma.groupes.findUnique({where: { id: dto.id}});
		if (!find_groupe || (!find_groupe.admin.includes(user.id) && find_groupe.owner != user.id))
			throw "error groupe";
		const body = {status: "MODIFY", data: plainToClass(GroupeEntity, await this.prisma.groupes.update({
			where: {
			id: dto.id},
			data: {
			channel_name: dto.channel_name,
			password: this.getPassword(dto.password),
			private_groupe: dto.private_groupe,
			owner: user.id,
		}}))};
		body.data.displayName = body.data.channel_name;
		return [client.id, body as any];
	} 

	async privateChannel(client : Socket, dto: ChannelDto) {
		const user = await this.getUserSocket(client);
		const groupeExist = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
		if (groupeExist)
			throw "groupe already exist";
		const friend = await this.prisma.user.findUnique({where: {name: dto.channel_name}});
		if (user.blocked.includes(friend.id) || friend.blocked.includes(user.id))
			throw "Blocked";
		const body = {status: "PRIVATE", data: plainToClass(GroupeEntity, await this.prisma.groupes.create({data: {
			channel_name: "$" + user.name + "$" + dto.channel_name,
			password: this.getPassword(""),
			private_groupe: true,
			private_message: true,
			owner: 0,
			admin: [0],
			members: [user.id, friend.id],
		}}))};
		body.data.displayName = body.data.channel_name;
		client.join(body.data.id.toString());
		// console.log(body);
		return [[client.id.toString(), this.clients.get(friend.name)], body as any];
	}

	async deleteChannel(client: Socket, id: number) {
		const user = await this.getUserSocket(client);
		const find_groupe = await this.prisma.groupes.findUnique({where: { id: id}});
		if (!find_groupe || find_groupe.owner != user.id)
			throw "error groupe";
		const body = {status: "DELETE", data: (plainToClass(GroupeEntity, await this.prisma.groupes.delete({where :{id:id}})))};
		await this.prisma.messages.deleteMany({where: {receiver: id}});
		return [client.id.toString(), body as any];
	} 

	async handleEvent(client: Socket, dto: EventChannelDto) {
		switch (dto.event) {
			case "BAN":
				return this.banUser(dto, client);
			case "UNBAN":
				return this.unBanUser(dto, client);
			case "KICK":
				return this.kickUser(dto, client);
			case "PROMOTE":
				return this.promuteUser(dto, client);
			case "UNPROMOTE":
				return this.unPromuteUser(dto, client);
			case "JOIN":
				return this.joinChannel(dto, client);
			case "LEFT":
				return this.leftChannel(dto, client)
			default:
				return ["ERROR", client.id, "Bad event"];
		}
	}

	async joinChannel(dto: EventChannelDto, client: Socket) {
		try {
			const id = (await this.getUserSocket(client)).id;
			let groupe = await this.prisma.groupes.findUnique({where: {
				channel_name: dto.channel_name,
				private_message: false,
			}});
			if ( groupe.private_groupe && compareSync(dto.password, groupe.password) == false) {
				throw "badCredentials";
			}
			if (groupe.banned.includes(id))
			throw "userNotAuthorized";
			if (groupe.members.includes(id))
			throw  "alreadyInchannel";
			groupe.members.push(id);
			client.join(groupe.id.toString());
			const groupeUpdated = plainToClass(GroupeEntity, await this.prisma.groupes.update({
				where: {
				id: groupe.id},
				data: { 
					members: groupe.members
			}}))
			groupeUpdated.displayName = groupeUpdated.channel_name;
			return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async leftChannel(dto: EventChannelDto, client: Socket) {
		const id = (await this.getUserSocket(client)).id;
		// console.log("LEFT ING");
		try {
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if (!groupe.members.includes(id) || groupe.private_message)
				throw "Not authorized";
			groupe.members.splice(groupe.members.indexOf(id), 1);
			if (groupe.admin.includes(id))
				groupe.admin.splice(groupe.admin.indexOf(id), 1);
			const groupeUpdated = plainToClass(GroupeEntity, await this.prisma.groupes.update({
				where: {
				id: groupe.id},
				data: {
					members: groupe.members,
					admin: groupe.admin
			}}));
		// console.log("HER");
		// console.log(client.rooms);
			client.leave(groupe.id.toString());
		// console.log(client.rooms);
		// console.log("HER");
			return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async kickUser(dto: EventChannelDto, client: Socket) {
		const user = await this.getUserSocket(client);
		try {
			const user_kick = await this.prisma.user.findUnique({where: {name: dto.username}});
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if (!groupe.members.includes(user_kick.id) ||
				groupe.private_message ||
				groupe.owner == user_kick.id ||
				!groupe.admin.includes(user.id) || (
					groupe.owner != user.id &&
						groupe.admin.includes(user.id) &&
						groupe.admin.includes(user_kick.id)
			))
			throw "Not authorized";
			groupe.members.splice(groupe.members.indexOf(user_kick.id), 1);
			if (groupe.admin.includes(user_kick.id))
			groupe.admin.splice(groupe.admin.indexOf(user_kick.id), 1);
			await client.leave(groupe.id.toString());
			const groupeUpdated = plainToClass(GroupeEntity,await this.prisma.groupes.update({
				where: {
				id: groupe.id},
				data: {
					members: groupe.members,
					admin: groupe.admin
			}}));
			return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async banUser(dto : EventChannelDto, client: Socket) {
		const user = await this.getUserSocket(client);
		try {
			const user_ban = await this.prisma.user.findUnique({where: {name: dto.username}})
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if (!groupe.banned.includes(user_ban.id) && (groupe.admin.includes(user.id) && 
				!groupe.admin.includes(user_ban.id)) || groupe.owner == user.id) {
				if (groupe.banned.includes(user_ban.id))
				throw "Already ban"
				groupe.banned.push(user_ban.id);
				groupe.members.splice(groupe.members.indexOf(user_ban.id), 1);
				if (groupe.admin.includes(user_ban.id) && groupe.owner == user.id)
				groupe.admin.splice(groupe.members.indexOf(user_ban.id), 1);
			client.leave(groupe.id.toString());
				const groupeUpdated = plainToClass(GroupeEntity,await this.prisma.groupes.update({
					where: {
					id: groupe.id}, 
					data: {
						banned: groupe.banned, 
						members: groupe.members,
						admin: groupe.admin
				}}));
				return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
			}
			else
				throw "Not authorized";
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async unBanUser(dto: EventChannelDto, client: Socket) {
		const user = await this.getUserSocket(client);
		try {
			const user_unban = await this.prisma.user.findUnique({where: {name: dto.username}})
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if(!groupe.members.includes(user.id))
			throw ("Not authorized");
			if (groupe.banned.includes(user_unban.id) && groupe.admin.includes(user.id))
			{
				groupe.banned.splice(groupe.banned.indexOf(user_unban.id), 1);
				const groupeUpdated = plainToClass(GroupeEntity, await this.prisma.groupes.update({where: {id: groupe.id}, data: {banned: groupe.banned}}));
				return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
			}
			if (!groupe.banned.includes(user.id))
				throw ("User not banned");
			throw ("Not authorized");
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async promuteUser(dto: EventChannelDto, client: Socket) {
		const user = await this.getUserSocket(client);
			// console.log("\n\nLOG\n\n", dto.username);
		try {
			const user_promute = await this.prisma.user.findUnique({where: {name: dto.username}})
			let groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if (!groupe.admin.includes(user.id))
				throw ("Not authorized");
			if (groupe.admin.includes(user_promute.id))
				throw ("User already admin");
			if (groupe.admin.includes(user.id) || groupe.owner == user.id) {
				groupe.admin.push(user_promute.id);
				const groupeUpdated = plainToClass(GroupeEntity, await this.prisma.groupes.update({
					where: {
					id: groupe.id}, 
					data: {
						admin: groupe.admin
				}}));
				return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
			}
			throw ("Not authorized");
		} catch (error) {
			console.log(error)
			return ["ERROR", client.id, error];
		}
	}

	async unPromuteUser(dto: EventChannelDto, client: Socket) {
		const user = await this.getUserSocket(client);
		try {
			const user_unpromute = await this.prisma.user.findUnique({where: {name: dto.username}})
			const groupe = await this.prisma.groupes.findUnique({where: {channel_name: dto.channel_name}});
			if (groupe.owner == user.id && groupe.admin.includes(user_unpromute.id) && user_unpromute.id != user.id) {
				groupe.admin.splice(groupe.admin.indexOf(user_unpromute.id), 1);
				const groupeUpdated = plainToClass(GroupeEntity, await this.prisma.groupes.update({where: {id: groupe.id}, data: {admin: groupe.admin}}));
				return [dto.event , [groupe.id.toString(), client.id], groupeUpdated];
			}
			if (!groupe.admin.includes(user_unpromute.id) && user_unpromute.id != user.id) 
				throw ("User not admin");
			throw ("Not authorized");
		} catch (error) {
			return ["ERROR", client.id, error];
		}
	}

	async messageEvent(client: Socket, dto: MessageDto)
	{
		// console.log(client.rooms);
		const id = (await this.getUserSocket(client)).id;
		if (dto.content && dto.id)
			return await this.modifyMessage(dto, id)
		else if(!dto.content && dto.id )
			return await this.deleteMessage(dto, id)
		else
			return await this.postMessage(dto, id)
	}

	async postMessage(dto: MessageDto, id: number) {
		try {
			const groupe = await this.prisma.groupes.findUnique({where: { channel_name: dto.channel_name}});
			if (!groupe)
				throw ("groupeNotFound");
			if (!groupe.members.includes(id))
				throw ("userNotAuthorized");
			// console.log(groupe.id);
			if (!dto.content)
				return [groupe.id.toString(), ""];	
			return [groupe.id.toString(), await this.prisma.messages.create({data: {
				sender: id,
				receiver: groupe.id,
				content: dto.content
			}})];
		} catch (error) {
			return [id, error];
		}
	}

	async modifyMessage(dto: MessageDto, id: number) {
		try {
			const groupe = await this.prisma.groupes.findUniqueOrThrow({where: { channel_name: dto.channel_name}});
			const message = await this.prisma.messages.findUnique({where: {id: dto.id}});
			if (!groupe)
				throw ("channelNotFound");
			if (!groupe.members.includes(id) || !message || message.sender != id)
				throw ("userNotAuthorized");
			return [groupe.id.toString(), (await this.prisma.messages.update({
				where: {id: dto.id, sender: id},
				data: {
					content: dto.content}}))];
		} catch (error) {
			return [id, error];
		}
	}

	async deleteMessage( dto: MessageDto, id: number) {
		try {
			const groupe = await this.prisma.groupes.findUniqueOrThrow({where: { channel_name: dto.channel_name}});
			const message = await this.prisma.messages.findUniqueOrThrow({where : {id: dto.id}});
			if (!groupe.members.includes(id) || (message.sender != id && !groupe.admin.includes(id)))
			throw ("userNotAuthorized");
			return [groupe.id.toString(), await this.prisma.messages.delete({where: {id: dto.id}})];
		} catch (error) {
			return [id, error];
		}
	}

	async getUserSocket(client: Socket) {
		const jwt = client.handshake.headers.cookies as string;			
		const username = this.jwt.decode(jwt).sub;
		const user = await this.prisma.user.findUnique(({where: {id: username}}));
		if (!user)
		throw ('User not found');	
		return user;
	}

	// extractJwt(cookies: string) {
	// 	const all_cookies = cookies.split(" ");
	// 	for (let i = 0; i < all_cookies.length; i++) {
	// 		const cookie = all_cookies[i].split('=')
	// 		if (cookie[0] == 'jwt')
	// 			return cookie[1];
	// 	}
	// 	throw new WsException("Not jwt found");
 //    
	// }

	getPassword(password: string) : string {
		return (password == "" ? password : hashSync(password, ""));
	}

  async getUsernameJwt(req: ExpressRequest) {
	  const userId = this.jwt.decode(req.headers.authorization.split(" ")[1]).sub;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user.name;
  }
}
