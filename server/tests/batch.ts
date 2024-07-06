import { createHash } from 'crypto';
import { genImage, sendChat } from 'domain/work/event/workevent';
import { workMethod } from 'domain/work/model/workMethod';
import { novelQuery } from 'domain/work/repository/novelQuery';
import { writeFileSync } from 'fs';
import { basename, join } from 'path';

const main = async (): Promise<void> => {
  const novelUrl = 'https://www.aozora.gr.jp/cards/000879/files/127_15260.html';
  const { html, title, author } = await novelQuery.scrape(novelUrl);
  const filePath = join(__dirname, 'www.aozora.gr.jp/files', basename(novelUrl));

  writeFileSync(filePath, html);

  const loadingWork = await workMethod.create({ novelUrl, title, author });
  const chatResult = await sendChat(loadingWork, html);
  const imagesResult = await genImage(chatResult.imagePrompt);

  const chatHash = createHash('md5').update(chatResult.chatPrompt).digest('hex');
  const imagesHash = createHash('md5').update(chatResult.imagePrompt).digest('hex');

  const chatFilePath = join(__dirname, 'api.openai.com/chat', `${chatHash}.json`);
  const imagesFilePath = join(__dirname, 'api.openai.com/images', `${imagesHash}.json`);

  writeFileSync(chatFilePath, JSON.stringify(chatResult.res), 'utf-8');
  writeFileSync(imagesFilePath, JSON.stringify(imagesResult.res), 'utf-8');
};

main();
