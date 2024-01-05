type JsonResponse = {
  json: string;
};

type PagesResponse = {
  pages: string[];
};

export type JsonLinksResponse = JsonResponse | PagesResponse;
