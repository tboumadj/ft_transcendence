import { Exclude } from "class-transformer";

export class GroupeEntity {

	@Exclude()
	password: string;

	id: number;

	
	members: number[];

	amdin: number[];

	banned: number[];
	private_message: boolean;	
	private_groupe: boolean;	
	channel_name: string;
	displayName: string; 
}

export class MessageEntity {

	@Exclude()
	receiver: string;
}
