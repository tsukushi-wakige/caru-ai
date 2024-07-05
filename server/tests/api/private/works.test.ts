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
  const novelUrl = 'https://example.com';
  const title = 'title';
  const author = 'author';
  const res = await userClient.private.works.$post({
    body: { novelUrl, title, author },
  });

  expect(res).toMatchObject({ novelUrl, title, author });
});
