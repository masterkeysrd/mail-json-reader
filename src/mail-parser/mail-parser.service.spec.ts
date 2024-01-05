import { Test, TestingModule } from '@nestjs/testing';
import { MailParserService } from './mail-parser.service';
import * as fs from 'fs';
import { AddressObject } from 'mailparser';

describe('MailParserService', () => {
  let mailParserService: MailParserService;
  let email: string;

  beforeAll(async () => {
    email = fs.readFileSync('./test/data/mail-with-attachment.eml', 'utf8');
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [MailParserService],
    }).compile();

    mailParserService = app.get<MailParserService>(MailParserService);
  });

  describe('parseMail', () => {
    it('should return a parsed mail', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      expect(parsedMail).toBeDefined();
    });

    it('should return a parsed mail with a subject', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      expect(parsedMail.subject).toEqual('Testing');
    });

    it('should return a parsed mail with a from address', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      expect(parsedMail.from.value[0].address).toEqual('johndoe.email.com');
    });

    it('should return a parsed mail with a to address', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      const to = parsedMail.to as AddressObject;
      expect(to.value[0].address || to.value[0].name).toEqual(
        'janedoe.email.com',
      );
    });

    it('should return a list of attachments', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      expect(parsedMail.attachments).toHaveLength(1);
    });
  });

  describe('getEmailAttachment', () => {
    it('should return the content of the attachment', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      const attachment = mailParserService.getEmailAttachment(
        parsedMail,
        'application/json',
      );
      expect(attachment).toBeDefined();
    });

    it('should return undefined when the attachment is not found', async () => {
      const parsedMail = await mailParserService.parseMail(email);
      const attachment = mailParserService.getEmailAttachment(
        parsedMail,
        'application/pdf',
      );
      expect(attachment).toBeUndefined();
    });
  });
});
