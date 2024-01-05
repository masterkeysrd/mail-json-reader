import { HttpException } from '@nestjs/common';

export class FileDoesNotExistException extends HttpException {
  constructor() {
    super('File does not exist', 404);
  }
}

export class EmailUrlDoesNotExistException extends HttpException {
  constructor() {
    super('Email URL does not exist', 404);
  }
}
