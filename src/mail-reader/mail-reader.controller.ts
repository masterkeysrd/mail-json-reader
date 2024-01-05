import { Controller, Post } from '@nestjs/common';

@Controller('mail-reader')
export class MailReaderController {
  @Post()
  async getJsonFromMail(url: string): Promise<any> {
    return {};
  }
}
