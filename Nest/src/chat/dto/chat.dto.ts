import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IntersectionType } from '@nestjs/swagger'

export class ChannelNameDto {

	@MinLength(1)
	@MaxLength(100)
	channel_name: string; 

}

export class MessageContentDto {

	@MaxLength(1024)
	@IsString()
	@IsNotEmpty()
	content: string; 

}

export class IdDto {

	@IsNumber()
	id: number;

}

export class UserNameDto {

	@MinLength(1)
	@MaxLength(1024)
	username: string;

}

export class ChannelDto extends ChannelNameDto {

	@IsOptional()
	@IsBoolean()
	private_message: boolean;

	@IsOptional()
	@IsBoolean()
	private_groupe: boolean;

	password: string;

}

export class FullChannelDto extends IntersectionType(IdDto, ChannelDto) {
	
}

export class Channel_NameId_Dto extends IntersectionType(ChannelNameDto, IdDto) { 

}
 
export class MessageDto extends IntersectionType(ChannelNameDto, MessageContentDto, IdDto) {

}

export class ChannelToUserDto extends IntersectionType(ChannelNameDto, UserNameDto) {


}

export class EventChannelDto extends IntersectionType(UserNameDto, ChannelNameDto) {
	
	@IsString()
	event: string;

	@IsString()
	password: string;

}
