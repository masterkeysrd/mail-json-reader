import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

type JsonFromEmailBody = {
  source: string;
  location: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/v1/json-from-mail')
  @HttpCode(200)
  async getJsonFromEmail(@Body() body: JsonFromEmailBody): Promise<string> {
    const { source, location } = body;
    return this.appService.getJsonFromEmail(source, location);
  }
}
