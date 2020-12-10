import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from 'game-matrix';
const g: Game = new Game({});
g.createPlayer();
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return g.plain();
  }

  @Get('/create-player')
  addPlayer() {
    return g.createPlayer().plain();
  }
}
