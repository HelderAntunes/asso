/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  {
    path: '/network',
    name: 'network',
    component: () => import('@/views/Network/Index'),
  },
  {
    path: '/subscribers',
    name: 'subscribers',
    component: () => import('@/views/Subscribers/Index'),
  },
  {
    path: '/subscribers/{id}',
    name: 'subscribers.show',
    component: () => import('@/views/Subscribers/Show'),
  },
  {
    path: '/topics',
    name: 'topics',
    component: () => import('@/views/Topics/Index'),
  },
  {
    path: '/topics/{id}',
    name: 'topics.show',
    component: () => import('@/views/Topics/Show'),
  },
  {
    path: '/',
    redirect: '/network',
  },

  {
    path: '/*',
    redirect: '/network',
  },
];
