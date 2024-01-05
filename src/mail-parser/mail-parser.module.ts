import { Module } from '@nestjs/common';
import { MailParserService } from './mail-parser.service';

@Module({
  providers: [MailParserService],
  exports: [MailParserService],
})
export class MailParserModule {}
