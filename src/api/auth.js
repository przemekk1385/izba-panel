import Base from '@/api/base';

const resource = 'auth/token/';
export default {
  login(payload) {
    return Base.post(`${resource}login/`, payload);
  },
  logout(headers) {
    return Base.post(`${resource}logout/`, null, { headers });
  },
};
