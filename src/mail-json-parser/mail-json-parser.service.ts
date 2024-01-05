import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MailReaderService } from '../mail-reader/mail-reader.service';
import { MailParserService } from '../mail-parser';
import { HtmlUtil } from '../utils/html.util';
import { JsonLinksResponse } from './types';
import { NotJsonException } from './mail-json-parser.exceptions';
import { ParsedMail } from 'mailparser';

@Injectable()
export class MailJsonParserService {
  constructor(
    private readonly mailReaderService: MailReaderService,
    private readonly mailParserService: MailParserService,
    private readonly httpService: HttpService,
  ) {}

  async getJsonFromEmail(source: string, location: string): Promise<string> {
    const mail = await this.mailReaderService.getMail(source, location);

    const parsedMail = await this.mailParserService.parseMail(mail);

    const attachmentJson = this.getJsonFromAttachment(parsedMail);
    if (attachmentJson) {
      return attachmentJson;
    }

    const linksJsonResponse = await this.getJsonFromLinks(parsedMail);

    if (linksJsonResponse) {
      if ('json' in linksJsonResponse) {
        return linksJsonResponse.json;
      }

      const jsonFromPages = await this.getJsonFromPages(
        linksJsonResponse.pages,
      );
      if (jsonFromPages) {
        return jsonFromPages;
      }
    }

    throw new NotJsonException();
  }

  private getJsonFromAttachment(parsedMail: any): string {
    const json = this.mailParserService.getEmailAttachment(
      parsedMail,
      'application/json',
    );

    if (json) {
      return json;
    }
  }

  private async getJsonFromLinks(
    parsedMail: ParsedMail,
  ): Promise<JsonLinksResponse> {
    const pages: string[] = [];

    const links = HtmlUtil.getLinksFromHtml(parsedMail.textAsHtml);

    if (!links) {
      return;
    }

    for await (const link of links) {
      const response = await lastValueFrom(this.httpService.get(link));

      if (response.status !== 200) {
        continue;
      }

      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        return { json: response.data };
      }

      if (contentType.includes('text/plain')) {
        if (typeof response.data === 'string') {
          return { json: response.data };
        }

        if (typeof response.data === 'object') {
          return { json: JSON.stringify(response.data) };
        }
      }

      if (contentType.includes('text/html')) {
        pages.push(response.data);
      }
    }

    return { pages };
  }

  private async getJsonFromPages(pages: string[]): Promise<string> {
    for (const page of pages) {
      const linksFromPage = HtmlUtil.getLinksFromHtml(page);
      for await (const link of linksFromPage) {
        const response = await lastValueFrom(this.httpService.get(link));
        const contentType = response.headers['content-type'];

        if (contentType.includes('application/json')) {
          return response.data;
        }

        if (contentType.includes('text/plain')) {
          if (typeof response.data === 'string') {
            return response.data;
          }

          if (typeof response.data === 'object') {
            return JSON.stringify(response.data);
          }
        }
      }
    }
  }
}
