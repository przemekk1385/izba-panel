import Base from '@/api/base';

const resource = 'posts/';
export default {
  create(payload, headers) {
    return Base.post(resource, payload, { headers });
  },
  destroy(pk, headers) {
    return Base.delete(`${resource}${pk}/`, { headers });
  },
  list() {
    return Base.get(resource);
  },
  retrieve(pk) {
    return Base.get(`${resource}${pk}/`);
  },
  update(pk, payload, headers) {
    return Base.put(`${resource}${pk}/`, payload, { headers });
  },
};
