import { Module } from '@nestjs/common';
import { MailReaderService } from './mail-reader.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MailReaderService],
  exports: [MailReaderService],
})
export class MailReaderModule {}
