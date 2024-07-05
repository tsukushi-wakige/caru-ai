import { novelQuery } from 'domain/work/repository/novelQuery';
import { existsSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

const main = async (): Promise<void> => {
  const novelUrl = 'https://www.aozora.gr.jp/cards/000879/files/128_15261.html';
  const filePath = join(__dirname, 'www.aozora.gr.jp/files', basename(novelUrl));

  if (!existsSync(filePath)) {
    const { html } = await novelQuery.scrape(novelUrl);
    writeFileSync(filePath, html);
  }
};

main();
