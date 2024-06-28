import { load } from 'cheerio';
import { decode } from 'iconv-lite';
import { transaction } from 'service/prismaClient';

export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      const buffer = await fetch(aozoraUrl).then((b) => b.arrayBuffer());
      const $ = load(decode(Buffer.from(buffer), 'Shift_JIS'));
      const body = $('body');
      return body.text();
    }),
};
