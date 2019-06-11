/*
  eslint no-param-reassign: [
    "error",
    {
      "props": true,
      "ignorePropertyModificationsFor": [
        "state",
        "acc",
        "e",
        "ctx",
        "req",
        "request",
        "res",
        "response",
        "$scope"
      ]
    }
  ]
*/

import Vue from 'vue';
import Vuex from 'vuex';

import { Factory } from '@/api/factory';

Vue.use(Vuex);

const Auth = Factory.get('auth');
export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || undefined,
    username: localStorage.getItem('username') || '',
  },
  mutations: {
    authSuccess(state, { token, username }) {
      state.token = token;
      state.username = username;
    },
    authWipe(state) {
      state.token = undefined;
      state.username = '';
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await Auth.login(credentials);
      const { auth_token: token } = data;
      const { username } = credentials;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      commit('authSuccess', { token, username });
    },
    async logout({ commit, state }) {
      const headers = {
        Authorization: `Token ${state.token}`,
      };
      await Auth.logout(headers)
        .catch(() => {})
        .finally(() => {
          localStorage.clear();
          commit('authWipe');
        });
    },
  },
  getters: {
    token: state => state.token,
    username: state => state.username,
  },
});
