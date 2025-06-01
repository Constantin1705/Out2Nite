import type { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue'



const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'test', component: () => import('pages/TestPage.vue') },
      { path: 'test2', component: () => import('pages/TestPage2.vue') },
      { path: 'testmap', component: () => import('pages/TestMap.vue') },
      { path: 'map', component: () => import('pages/MapPage.vue'), meta: { requiresAuth: true } },
      { path: 'list', component: () => import('pages/ListPage.vue'), meta: { requiresAuth: true } },


    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
