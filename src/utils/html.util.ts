export class HtmlUtil {
  static async *getLinksFromHtml(html: string): AsyncGenerator<string> {
    const htmlWithoutNewLines = html.replace(/\n/g, '');
    const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    let match;
    while ((match = regex.exec(htmlWithoutNewLines))) {
      yield match[2];
    }

    return;
  }
}
