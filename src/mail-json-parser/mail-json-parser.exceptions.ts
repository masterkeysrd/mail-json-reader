import { HttpException } from '@nestjs/common';

export class NotJsonException extends HttpException {
  constructor() {
    super('No JSON found on the email', 400);
  }
}
