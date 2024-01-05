import { createServer } from 'http';
import * as fs from 'fs';

const fileMapping = {
  '/page.html': {
    contentType: 'text/html',
    file: './test/data/page.html',
  },
  '/data.json': {
    contentType: 'application/json',
    file: './test/data/data.json',
  },
  '/mail-with-link.eml': {
    contentType: 'text/plain',
    file: './test/data/mail-with-link.eml',
  },
  '/mail-with-link-to-page.eml': {
    contentType: 'text/plain',
    file: './test/data/mail-with-link-to-page.eml',
  },
  '/mail-with-attachment.eml': {
    contentType: 'text/plain',
    file: './test/data/mail-with-attachment.eml',
  },
};

const server = createServer((req, res) => {
  const file = fileMapping[req.url];

  if (!file) {
    res.writeHead(404);
    res.end();
    return;
  }

  const fileContent = fs.readFileSync(file.file, 'utf8');
  res.setHeader('Content-Type', file.contentType);
  res.end(fileContent);
});

server.listen(8080, () => {
  console.log('Server started on port 8080');
});
