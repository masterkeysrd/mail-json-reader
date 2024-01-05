# Testing File Server

This is a simple file server for testing purposes. It is not intended for
being used in production. It is a simple server that serves files from a
`test/data` directory.

## Usage

```bash
npm run start:test-server
```

> The server will be listening on port 8080.

To get a file from the server, just make a request to the server with the
the next URL format:

```
http://localhost:8080/<file>
```

The server will look for the file in the `test/data` directory and will
serve it if it exists. If the file does not exist, the server will return
not found.

The next files are available:

* `data.json`: A JSON file with some data.
* `mail-with-attachment.eml`: An email with an attachment.
* `mail-with-link-to-page.eml`: An email with a link to a page.
* `mail-with-link`: An email with a link to a file.
