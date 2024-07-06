import type { EntityId } from 'api/@types/brandedId';
import type { WorkEntity } from 'api/@types/work';
import { ContentLoading } from 'components/loading/ContentLoading';
import { Loading } from 'components/loading/Loading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './works.module.css';

type ContentDict = Record<EntityId['work'], string | undefined>;

const MainContent = (props: { work: WorkEntity; contentDict: ContentDict }) => {
  switch (props.work.status) {
    case 'loading':
      return (
        <div style={{ height: '500px' }}>
          <ContentLoading />
        </div>
      );
    case 'completed':
      return (
        <div className={styles.imageFrame}>
          <img src={props.work.imageUrl} alt={props.work.title} className={styles.workImage} />
          <div
            className={styles.contentText}
            dangerouslySetInnerHTML={{ __html: props.contentDict[props.work.id] ?? '' }}
          />
        </div>
      );
    case 'failed':
      return <div className={styles.errorMsg}>{props.work.errorMsg}</div>;
    /* v8 ignore next 2 */
    default:
      throw new Error(props.work satisfies never);
  }
};

export const Works = () => {
  const catchApiErr = useCatchApiErr();
  const [works, setWorks] = useState<WorkEntity[]>();
  const [contentDict, setContentDict] = useState<ContentDict>({});
  const [novelUrl, setNovelUrl] = useState('');

  const fetchContent = useCallback(async (w: WorkEntity) => {
    const content = await fetch(w.contentUrl).then((b) => b.text());
    setContentDict((dict) => ({ ...dict, [w.id]: content }));
  }, []);

  const createWork = async (e: FormEvent) => {
    e.preventDefault();
    setNovelUrl('');

    const work = await apiClient.private.works.$post({ body: { novelUrl } }).catch(catchApiErr);

    if (work !== null && works?.every((w) => w.id !== work.id)) {
      setWorks((works) => [work, ...(works ?? [])]);
    }
  };

  useEffect(() => {
    if (works !== undefined) return;

    apiClient.private.works
      .$get()
      .then((ws) => {
        setWorks(ws);
        return Promise.all(ws.map(fetchContent));
      })
      .catch(catchApiErr);
  }, [catchApiErr, works, contentDict, fetchContent]);

  if (!works) return <Loading visible />;

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={createWork}>
          <input
            value={novelUrl}
            className={styles.textInput}
            type="text"
            placeholder="青空文庫の作品ページURL"
            onChange={(e) => setNovelUrl(e.target.value)}
          />
          <div className={styles.controls}>
            <input className={styles.btn} disabled={novelUrl === ''} type="submit" value="CREATE" />
          </div>
        </form>
      </div>
      {works.map((work) => (
        <div key={work.id} className={styles.card}>
          <div className={styles.form}>
            <MainContent work={work} contentDict={contentDict} />
            <div className={styles.title}>
              {work.title} - {work.author}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
