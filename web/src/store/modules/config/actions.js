/* ============
 * Actions for the queue module
 * ============
 *
 * The actions that are available on the
 * queue module.
 */

import * as types from './mutation-types';

export const show = ({ commit }, payload) => {
  commit(types.SHOW, payload);
};

export const hide = ({ commit }) => {
  commit(types.HIDE);
};

export const update = ({ commit }, payload) => {
  commit(types.UPDATE, payload);
};

export default {
  show,
  hide,
  update,
};
