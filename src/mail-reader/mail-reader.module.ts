import { Module } from '@nestjs/common';
import { MailReaderController } from './mail-reader.controller';

@Module({
  imports: [],
  controllers: [MailReaderController],
  providers: [],
})
export class MailReaderModule {}
