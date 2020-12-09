import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from 'game-matrix';
const g = new Game({});
g.createPlayer(1);
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return [g.player.plain()];
  }
}
