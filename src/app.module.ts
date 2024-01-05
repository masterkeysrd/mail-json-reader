import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailJsonParserModule } from './mail-json-parser';

@Module({
  imports: [MailJsonParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
