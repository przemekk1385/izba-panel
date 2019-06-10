import Base from '@/api/base';

const resource = 'entities/';
export default {
  create(payload, headers) {
    return Base.post(resource, payload, { headers });
  },
  destroy(pk, headers) {
    return Base.delete(`${resource}${pk}/`, { headers });
  },
  list(type) {
    return Base.get(`${resource}?type=${type}`);
  },
  retrieve(pk) {
    return Base.get(`${resource}${pk}/`);
  },
  update(pk, payload, headers) {
    return Base.patch(`${resource}${pk}/`, payload, { headers });
  },
};
