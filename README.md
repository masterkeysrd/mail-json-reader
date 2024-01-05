# Mail JSON Reader

## About

This is a simple application that reads a mail file and returns a JSON from the following sources:

* Attachment
* A link to a json file
* A link to a page with a json file

## Usage

To run the application, just execute the next command:

```bash
npm run start
# or
npm run start:dev # For development
```

For testing purposes, you can use the `test/server` server. See the [Testing File Server](./test/server/README.md) page for more information.

The application will be running on `http://localhost:3000` and the endpoint will be `POST http://localhost:3000/api/v1/json-from-mail` with the following body:

```json
{
  "source": "<local|remote>",
  "location": "<path|url>",
}
```

> **Note:** The `source` and `location` fields are required.

## Testing

For unit testing, just run the next command:

```bash
npm run test
# or 
npm run test:cov # For coverage
```

For e2e testing, just run the next command:

First you need the `test/server` running. See the [Testing File Server](./test/server/README.md) page for more information.

```bash
npm run test:e2e
```
