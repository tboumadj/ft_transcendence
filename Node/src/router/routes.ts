import { RouteRecordRaw } from 'vue-router';
import Inscription from 'pages/MyInscription.vue';
import MyLogin from 'pages/MyLogin.vue';

  const authRoutes: Array<RouteRecordRaw> = [
   {  path: '/inscription', name: 'Inscription', component: () => import('layouts/MyLayout.vue'),
      children: [{ path: '', component: Inscription }],
   },
  { path: '/login', name: 'Login', component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: MyLogin }],
  },
 ];

const mainRoutes: RouteRecordRaw[] = [
  { path: '/', component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/PreHome.vue') }],
  },
  { path: '/game', name: 'Game', component: () => import('layouts/MyLayoutAuth.vue'),
    children: [{ path: '', component: () => import('pages/MyGame.vue') }],
  },
  { path: '/chat', name: 'Chat', component: () => import('layouts/MyLayoutAuth.vue'),
    children: [{ path: '', component: () => import('pages/MyChat.vue') }],
  },
  { path: '/home', component: () => import('layouts/MyLayoutAuth.vue'),
    children: [{ path: '', component: () => import('pages/MyHome.vue') }],
  },
  { path: '/friend/:id', name: 'Friend', component: () => import('layouts/MyLayoutAuth.vue'),
    children: [{ path: '', component: () => import('pages/FriendPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];


const routes: Array<RouteRecordRaw> = [...authRoutes, ...mainRoutes];

export default routes;
