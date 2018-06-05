/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  {
    path: '/network/statistics',
    name: 'network.statistics',
    component: () => import('@/views/Network/Statistics'),
  },
  {
    path: '/network/tree',
    name: 'network.tree',
    component: () => import('@/views/Network/Index'),
  },
  {
    path: '/devices',
    name: 'devices',
    component: () => import('@/views/Devices/Index'),
  },
  {
    path: '/devices/:id',
    name: 'devices.show',
    component: () => import('@/views/Devices/Show'),
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
    path: '/',
    redirect: '/network/tree',
  },

  {
    path: '/*',
    redirect: '/network/tree',
  },
];
