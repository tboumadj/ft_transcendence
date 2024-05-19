export declare class ChannelNameDto {
    channel_name: string;
}
export declare class MessageContentDto {
    content: string;
}
export declare class IdDto {
    id: number;
}
export declare class UserNameDto {
    username: string;
}
export declare class ChannelDto extends ChannelNameDto {
    private_message: boolean;
    private_groupe: boolean;
    password: string;
}
declare const FullChannelDto_base: import("@nestjs/common").Type<IdDto & ChannelDto>;
export declare class FullChannelDto extends FullChannelDto_base {
}
declare const Channel_NameId_Dto_base: import("@nestjs/common").Type<IdDto & ChannelNameDto>;
export declare class Channel_NameId_Dto extends Channel_NameId_Dto_base {
}
declare const MessageDto_base: import("@nestjs/common").Type<IdDto & ChannelNameDto & MessageContentDto>;
export declare class MessageDto extends MessageDto_base {
}
declare const ChannelToUserDto_base: import("@nestjs/common").Type<ChannelNameDto & UserNameDto>;
export declare class ChannelToUserDto extends ChannelToUserDto_base {
}
declare const EventChannelDto_base: import("@nestjs/common").Type<ChannelNameDto & UserNameDto>;
export declare class EventChannelDto extends EventChannelDto_base {
    event: string;
    password: string;
}
export {};
