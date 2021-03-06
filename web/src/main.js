/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */

import Vue from 'vue';

/* ============
 * Plugins
 * ============
 *
 * Import and bootstrap the plugins.
 */

import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import TreeView from 'vue-json-tree-view';
import './plugins/vuex';
import './plugins/axios';
import { router } from './plugins/vue-router';
import './plugins/vuex-router-sync';
import './plugins/element-ui';
import './plugins/basscss';

/* ============
 * Main App
 * ============
 *
 * Last but not least, we import the main application.
 */
import App from './App';
import store from './store';

Vue.use(TreeView);

const SocketInstance = socketio('http://localhost:8080');
Vue.use(VueSocketIO, SocketInstance);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  /**
   * Bind the Vue instance to the HTML.
   */
  el: '#app',

  /**
   * The router.
   */
  router,

  /**
   * The Vuex store.
   */
  store,

  /**
   * Will render the application.
   *
   * @param {Function} h Will create an element.
   */
  render: h => h(App),
});
