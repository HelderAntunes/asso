/* ============
 * Mutations for the queue module
 * ============
 *
 * The mutations that are available on the
 * queue module.
 */

import {
  SHOW,
  HIDE,
  UPDATE,
} from './mutation-types';

export default{
  [SHOW](state, obj) {
    state.visible = true;
    state.action = obj.action;
    state.modal = obj.modal;
  },

  [HIDE](state) {
    state.visible = false;
    state.action = '';
    state.modal = '';
  },

  [UPDATE](state, obj) {
    state.message = obj;
  },
};
