import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { GET, POST } from '../utils';

test(GET(noCookieClient.private.works), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.works.$get();

  expect(res).toHaveLength(0);
});

test(POST(noCookieClient.private.works), async () => {
  const userClient = await createUserClient();
  const novelUrl = 'https://www.aozora.gr.jp/cards/000879/files/128_15261.html';
  const res = await userClient.private.works.$post({
    body: { novelUrl },
  });
  expect(res).toMatchObject({
    title: '羅生門',
    author: '芥川龍之介',
  });
});
