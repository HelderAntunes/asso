/* ============
 * Font Awesome
 * ============
 *
 * Font Awesome gives you scalable vector icons that can instantly
 * be customized — size, color, drop shadow, and anything that can
 * be done with the power of CSS.
 *
 * http://fontawesome.io/
 */

const Vue = require('vue');
const fontawesome = require('@fortawesome/fontawesome');
const FontAwesomeIcon = require('@fortawesome/vue-fontawesome');
const solid = require('@fortawesome/fontawesome-free-solid');

fontawesome.library.add(solid);

Vue.component('font-awesome-icon', FontAwesomeIcon);
