"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventChannelDto = exports.ChannelToUserDto = exports.MessageDto = exports.Channel_NameId_Dto = exports.FullChannelDto = exports.ChannelDto = exports.UserNameDto = exports.IdDto = exports.MessageContentDto = exports.ChannelNameDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ChannelNameDto {
}
exports.ChannelNameDto = ChannelNameDto;
__decorate([
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ChannelNameDto.prototype, "channel_name", void 0);
class MessageContentDto {
}
exports.MessageContentDto = MessageContentDto;
__decorate([
    (0, class_validator_1.MaxLength)(1024),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MessageContentDto.prototype, "content", void 0);
class IdDto {
}
exports.IdDto = IdDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IdDto.prototype, "id", void 0);
class UserNameDto {
}
exports.UserNameDto = UserNameDto;
__decorate([
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(1024),
    __metadata("design:type", String)
], UserNameDto.prototype, "username", void 0);
class ChannelDto extends ChannelNameDto {
}
exports.ChannelDto = ChannelDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChannelDto.prototype, "private_message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChannelDto.prototype, "private_groupe", void 0);
class FullChannelDto extends (0, swagger_1.IntersectionType)(IdDto, ChannelDto) {
}
exports.FullChannelDto = FullChannelDto;
class Channel_NameId_Dto extends (0, swagger_1.IntersectionType)(ChannelNameDto, IdDto) {
}
exports.Channel_NameId_Dto = Channel_NameId_Dto;
class MessageDto extends (0, swagger_1.IntersectionType)(ChannelNameDto, MessageContentDto, IdDto) {
}
exports.MessageDto = MessageDto;
class ChannelToUserDto extends (0, swagger_1.IntersectionType)(ChannelNameDto, UserNameDto) {
}
exports.ChannelToUserDto = ChannelToUserDto;
class EventChannelDto extends (0, swagger_1.IntersectionType)(UserNameDto, ChannelNameDto) {
}
exports.EventChannelDto = EventChannelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventChannelDto.prototype, "event", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventChannelDto.prototype, "password", void 0);
//# sourceMappingURL=chat.dto.js.map