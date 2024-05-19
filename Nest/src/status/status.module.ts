import { Module } from "@nestjs/common";
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { StatusGateway } from './status.gateway';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [StatusController],
  providers: [StatusService, StatusGateway, PrismaService, JwtService],
  imports: [],
})
export class StatusModule {}
