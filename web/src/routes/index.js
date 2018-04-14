/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  // Home
  {
    path: '/home',
    name: 'home.index',
    component: () => import('@/pages/Home/Index'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: false,
    },
  },
  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/*',
    redirect: '/home',
  },
];
