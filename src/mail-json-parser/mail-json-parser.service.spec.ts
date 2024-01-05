import { Test, TestingModule } from '@nestjs/testing';
import { MailJsonParserService } from './mail-json-parser.service';
import { MailReaderService } from '../mail-reader/mail-reader.service';
import { MailParserService } from '../mail-parser';
import { HttpService } from '@nestjs/axios';
import { NotJsonException } from './mail-json-parser.exceptions';
import { of } from 'rxjs';

const mailReaderServiceMock = {
  getMail: jest.fn(),
};

const mailParserServiceMock = {
  parseMail: jest.fn(),
  getEmailAttachment: jest.fn(),
  getLinksFromMail: jest.fn(),
};

const httpServiceMock = {
  get: jest.fn(),
};

describe('MailJsonParserService', () => {
  let mailJsonParserService: MailJsonParserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MailJsonParserService,
        MailReaderService,
        MailParserService,
        HttpService,
      ],
    })
      .overrideProvider(MailReaderService)
      .useValue(mailReaderServiceMock)
      .overrideProvider(MailParserService)
      .useValue(mailParserServiceMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .compile();

    mailJsonParserService = app.get<MailJsonParserService>(
      MailJsonParserService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getJsonFromEmail', () => {
    it('should fail if no json is found', async () => {
      mailReaderServiceMock.getMail.mockResolvedValueOnce('mail');
      mailParserServiceMock.parseMail.mockResolvedValueOnce('parsedMail');
      mailParserServiceMock.getEmailAttachment.mockReturnValueOnce(null);
      mailParserServiceMock.getLinksFromMail.mockReturnValueOnce(null);

      await expect(
        mailJsonParserService.getJsonFromEmail('source', 'location'),
      ).rejects.toThrow(NotJsonException);
    });

    it('should return the json from the attachment', async () => {
      mailReaderServiceMock.getMail.mockResolvedValueOnce('mail');
      mailParserServiceMock.parseMail.mockResolvedValueOnce('parsedMail');
      mailParserServiceMock.getEmailAttachment.mockReturnValueOnce('json');

      const json = await mailJsonParserService.getJsonFromEmail(
        'source',
        'location',
      );

      expect(json).toEqual('json');
    });

    it('should return the json from the links', async () => {
      mailReaderServiceMock.getMail.mockResolvedValueOnce('mail');
      mailParserServiceMock.parseMail.mockResolvedValueOnce({
        textAsHtml: '<a href="link">link</a>',
      });
      mailParserServiceMock.getEmailAttachment.mockReturnValueOnce(null);
      mailParserServiceMock.getLinksFromMail.mockReturnValueOnce(
        'links' as any,
      );
      httpServiceMock.get.mockReturnValueOnce(
        of({
          data: 'json',
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      );

      const json = await mailJsonParserService.getJsonFromEmail(
        'source',
        'location',
      );

      expect(json).toEqual('json');
    });
  });
});
