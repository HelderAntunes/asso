<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"
    >
    <router-view></router-view>
  </div>
</template>
<script>
  /* ============
   * Entry Point
   * ============
   *
   * The entry point of the application
   */

  export default {
    /**
     * The name of the application.
     */
    name: 'ASSO',

    /**
     * Fires when the app has been mounted.
     */
    mounted() {
      this.$store.dispatch('account/find');
    },
  };
</script>
