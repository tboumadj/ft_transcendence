import { Injectable } from "@nestjs/common";
import { Request } from 'express';
import { Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusEntity } from "./entity/status.entity";

@Injectable()
export class StatusService {

  private clients : Map<number, StatusEntity>;

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService) {
    this.clients = new Map<number, StatusEntity>;
  }

  async handleconnection(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.set(user.id, {id: user.id, socket: client, state: 1});
      // console.log('clients Status = ', this.clients);
      client.join('logged');
      client.to('logged').emit('update', {room: 'logged'});
    } catch (error) {
      console.error('SocketStatus error: ', error);
    }
  }

  async handledisconnect(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.delete(user.id);
      client.to('logged').emit('update', {room: 'logged'});
      client.disconnect();
    } catch (error) {
      console.error('SocketStatus error: ', error);
    }
  }

  async getUserSocket(client: Socket) {
    try {
      const jwt = client.handshake.headers.cookies as string;
      const username = this.jwt.decode(jwt).sub;
      const user = await this.prisma.user.findUnique(({where: {id: username}}));
      if (!user) throw ('User not found');
      return user;
    } catch (error) {
      console.error('SocketStatus error: ', error);
    }
  }

  async setOnLine(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.set(user.id, {id: user.id, socket: client, state: 1});
      console.log('Status is [Online]');
      //console.log('ClientsStatus= ', this.clients);
      client.to('logged').emit('update', {room: 'logged'});
    } catch (error) {
      console.error('Cannot change Status : ', error);
    }
  }

  async setOffLine(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.set(user.id, {id: user.id, socket: client, state: 0});
      this.handledisconnect(client);
      console.log('Status is [Offline]');
      //console.log('ClientsStatus= ', this.clients);
    } catch (error) {
      console.error('Cannot change Status : ', error);
    }
  }

  async setInGame(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.set(user.id, {id: user.id, socket: client, state: 2});
      console.log('Status is [Ingame]');
      //console.log('ClientsStatus= ', this.clients);
      client.to('logged').emit('update', {room: 'logged'});
    } catch (error) {
      console.error('Cannot change Status : ', error);
    }
  }

  async setInChat(client: Socket) {
    try {
      const user = await this.getUserSocket(client);
      this.clients.set(user.id, {id: user.id, socket: client, state: 3});
      console.log('Status is [Inchat]');
      //console.log('ClientsStatus= ', this.clients);
      client.to('logged').emit('update', {room: 'logged'});
    } catch (error) {
      console.error('Cannot change Status : ', error);
    }
  }

  getStatus() {
    try {
      //const result = Map<number, {id: number, state: number}>;
      const result = new Map(this.clients);
      result.forEach(e => delete(e.socket));
      const Nresult = Object.fromEntries(result);

      return JSON.stringify(Nresult);
    } catch (error) {
      console.error('SocketStatus error: ', error);
    }
  }

}
