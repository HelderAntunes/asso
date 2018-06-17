<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"
    >
    <router-view/>
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
  sockets: {
    message(data) {
      const routePath = this.$route.path;
      if (!routePath.includes('/queues/')) {
        this.$socket.emit('publish_message', data);
      }
    },
  },
};
</script>
