import { Controller, Get, Put, Post, Req, Body, Res } from "@nestjs/common";
import { StatusService } from './status.service';
import { Request, Response } from 'express';

@Controller('/status')
export class StatusController{
  constructor(private readonly statusService: StatusService) {}

  @Get() 
  async getStatus() {
    return this.statusService.getStatus();
  }
}
