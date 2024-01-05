import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import {
  EmailUrlDoesNotExistException,
  FileDoesNotExistException,
} from './mail-reader.exceptions';

@Injectable()
export class MailReaderService {
  private readonly logger = new Logger(MailReaderService.name);

  constructor(private readonly httpService: HttpService) {}

  async getMail(source: string, location: string): Promise<any> {
    if (source === 'local') {
      return this.getMailFromLocal(location);
    }

    return this.getMailFromRemote(location);
  }

  async getMailFromLocal(location: string): Promise<any> {
    try {
      const file = fs.readFileSync(location, 'utf8');
      return file;
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(`File ${location} does not exist`);
        throw new FileDoesNotExistException();
      }

      throw error;
    }
  }

  async getMailFromRemote(location: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.httpService.get(location));
      return response.data;
    } catch (error) {
      this.logger.warn(`Error fetching mail from ${location}`);
      throw new EmailUrlDoesNotExistException();
    }
  }
}
