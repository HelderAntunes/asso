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
    path: '/queues',
    name: 'queues',
    component: () => import('@/views/Queues/Index'),
  },
  {
    path: '/queues/:id',
    name: 'queues.show',
    component: () => import('@/views/Queues/Show'),
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
