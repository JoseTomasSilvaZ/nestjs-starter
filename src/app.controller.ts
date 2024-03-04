import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(AuthGuard)
  @Get('test-guard')
  testGuard() {
    return { message: 'You are authorized', 'cat-says': 'meow' };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
