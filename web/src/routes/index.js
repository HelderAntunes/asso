/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  {
    path: '/network/statistics',
    name: 'network_statistics',
    component: () => import('@/views/Network/Statistics'),
  },
  {
    path: '/network/tree',
    name: 'network_tree',
    component: () => import('@/views/Network/Index'),
  },
  {
    path: '/subscribers',
    name: 'subscribers',
    component: () => import('@/views/Subscribers/Index'),
  },
  {
    path: '/subscribers/:id',
    name: 'subscribers.show',
    component: () => import('@/views/Subscribers/Show'),
  },
  {
    path: '/topics',
    name: 'topics',
    component: () => import('@/views/Topics/Index'),
  },
  {
    path: '/topics/:id',
    name: 'topics.show',
    component: () => import('@/views/Topics/Show'),
  },
  {
    path: '/teste',
    name: 'teste.vue',
    component: () => import('@/views/Test/Index'),
  },
  {
    path: '/',
    redirect: '/network/tree',
  },

  {
    path: '/*',
    redirect: '/network/tree',
  },
];
