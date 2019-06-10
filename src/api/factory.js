import Attachments from '@/api/attachments';
import Auth from '@/api/auth';
import Posts from '@/api/posts';
import Entities from '@/api/entities';

const reprositories = {
  attachments: Attachments,
  auth: Auth,
  entities: Entities,
  posts: Posts,
};
// eslint-disable-next-line
export const Factory = {
  get: name => reprositories[name],
};
