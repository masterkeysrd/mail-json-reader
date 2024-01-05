import { Module } from '@nestjs/common';
import { MailJsonParserService } from './mail-json-parser.service';
import { HttpModule } from '@nestjs/axios';
import { MailParserModule } from '../mail-parser';
import { MailReaderModule } from '../mail-reader/mail-reader.module';

@Module({
  imports: [HttpModule, MailParserModule, MailReaderModule],
  providers: [MailJsonParserService],
  exports: [MailJsonParserService],
})
export class MailJsonParserModule {}
