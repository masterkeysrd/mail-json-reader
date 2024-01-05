import { Injectable } from '@nestjs/common';
import { simpleParser, ParsedMail } from 'mailparser';

@Injectable()
export class MailParserService {
  async parseMail(mail: string): Promise<ParsedMail> {
    const parsedMail = await simpleParser(mail);
    return parsedMail;
  }

  getEmailAttachment(parsedMail: ParsedMail, contentType: string): string {
    const attachment = parsedMail.attachments.find(
      (attachment) => attachment.contentType === contentType,
    );

    if (attachment) {
      return attachment.content.toString('utf8');
    }
  }
}
