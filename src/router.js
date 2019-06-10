import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/404',
      name: '404',
      // route level code-splitting
      // this generates a separate chunk (404.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/posts',
      name: 'postsList',
      // route level code-splitting
      // this generates a separate chunk (postsList.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "postsList" */ './views/PostsList.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/posts/:id',
      name: 'postsEdit',
      // route level code-splitting
      // this generates a separate chunk (postsEdit.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "postsEdit" */ './views/PostsForm.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/entities/:type',
      name: 'entitiesList',
      // route level code-splitting
      // this generates a separate chunk (entitiesList.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "entitiesList" */ './views/Entities.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/entities/:type/:id',
      name: 'entitiesEdit',
      // route level code-splitting
      // this generates a separate chunk (entitiesEdit.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "entitiesEdit" */ './views/Entities.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/',
      redirect: '/posts',
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired) && !Store.getters.token) {
    next('login');
  } else {
    next();
  }
});

export default router;
