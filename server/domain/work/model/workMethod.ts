import type { CompletedWorkEntity, FailedWorkEntity, LoadingWorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { ulid } from 'ulid';
import { getContentKey, getImageKey } from '../service/getS3Key';

export const workMethod = {
  create: async (val: {
    novelUrl: string;
    title: string;
    author: string;
  }): Promise<LoadingWorkEntity> => {
    const id = brandedId.work.entity.parse(ulid());
    return {
      id: brandedId.work.entity.parse(ulid()),
      status: 'loading',
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContentKey(id)),
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
    };
  },
  complete: async (loadingWork: LoadingWorkEntity): Promise<CompletedWorkEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKey(loadingWork.id)),
    };
  },
  failure: (loadingWork: LoadingWorkEntity, errorMsg: string): FailedWorkEntity => {
    return {
      ...loadingWork,
      status: 'failed',
      errorMsg,
    };
  },
};
