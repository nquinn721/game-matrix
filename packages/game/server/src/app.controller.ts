import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from 'game-matrix';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const g = new Game({});
    return this.appService.getHello();
  }
}
