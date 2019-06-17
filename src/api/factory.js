import Attachments from '@/api/attachments';
import Auth from '@/api/auth';
import Entities from '@/api/entities';
import Posts from '@/api/posts';
import Upload from '@/api/upload';

const reprositories = {
  attachments: Attachments,
  auth: Auth,
  entities: Entities,
  posts: Posts,
  upload: Upload,
};
// eslint-disable-next-line
export const Factory = {
  get: name => reprositories[name],
};
