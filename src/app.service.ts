import { HttpException, Injectable } from '@nestjs/common';
import { MailJsonParserService } from './mail-json-parser';

@Injectable()
export class AppService {
  constructor(private mailJsonParserService: MailJsonParserService) {}

  async getJsonFromEmail(source: string, location: string): Promise<string> {
    if (['local', 'remote'].indexOf(source) === -1) {
      throw new HttpException('Invalid source', 400);
    }

    if (typeof location !== 'string') {
      throw new HttpException('Invalid location', 400);
    }

    const json = await this.mailJsonParserService.getJsonFromEmail(
      source,
      location,
    );
    return JSON.parse(json);
  }
}
