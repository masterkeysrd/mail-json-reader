import { HttpService } from '@nestjs/axios';
import { MailReaderService } from './mail-reader.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';
import { FileDoesNotExistException } from './mail-reader.exceptions';

const fsStub = fs as jest.Mocked<typeof fs>;
const getMock = jest.fn();

jest.mock('fs');

describe('MailReaderService', () => {
  let mailReaderService: MailReaderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [MailReaderService, HttpService],
    })
      .overrideProvider(HttpService)
      .useValue({ get: getMock })
      .compile();

    mailReaderService = app.get<MailReaderService>(MailReaderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMail', () => {
    it('should return mail from local', async () => {
      fsStub.readFileSync.mockReturnValue('test');

      jest
        .spyOn(mailReaderService, 'getMailFromLocal')
        .mockResolvedValue('test');
      expect(await mailReaderService.getMail('local', 'test')).toBe('test');
    });

    it('should return mail from remote', async () => {
      jest
        .spyOn(mailReaderService, 'getMailFromRemote')
        .mockResolvedValue('test');
      expect(await mailReaderService.getMail('remote', 'test')).toBe('test');
    });
  });

  describe('getMailFromLocal', () => {
    it('should return mail from local', async () => {
      fsStub.readFileSync.mockReturnValue('test');
      expect(await mailReaderService.getMailFromLocal('test')).toBe('test');
    });

    it('should throw error if file not found', async () => {
      fsStub.readFileSync.mockImplementation(() => {
        const err = Error(
          "ENOENT: no such file or directory, open 'test'",
        ) as any;
        err.code = 'ENOENT';
        throw err;
      });
      await expect(mailReaderService.getMailFromLocal('test')).rejects.toThrow(
        FileDoesNotExistException,
      );
    });

    it('should throw error if error is not file not found', async () => {
      fsStub.readFileSync.mockImplementation(() => {
        throw Error('test');
      });
      await expect(mailReaderService.getMailFromLocal('test')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getMailFromRemote', () => {
    it('should return mail from remote', async () => {
      const response = of({ data: 'test' });
      getMock.mockReturnValue(response as Observable<any>);
      expect(await mailReaderService.getMailFromRemote('test')).toBe('test');
    });
  });
});
