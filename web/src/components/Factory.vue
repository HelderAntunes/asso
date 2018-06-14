<template>
  <div id="wraper">
    <div
      id="stand1"
      class="stand"/>
    <div
      id="stand2"
      class="stand"/>
    <div id="band">
      <div
        id="wheel1"
        class="wheel"/>
      <div
        id="wheel2"
        class="wheel"/>
      <div
        id="wheel3"
        class="wheel"/>
      <div
        id="wheel4"
        class="wheel"/>
    </div>
    <div
      id="package1"
      class="package"/>
    <div id="mainFactory"/>
    <div id="door"/>
    <div
      id="window1"
      class="window"/>
    <div
      id="window2"
      class="window"/>
    <div id="chim1"/>
    <div id="chim2"/>
    <div id="roof1"/>
    <div id="roof2"/>
    <div
      id="stripe1"
      class="stripe"/>
    <div
      id="stripe2"
      class="stripe"/>
    <div
      id="stripe3"
      class="stripe"/>
    <div
      id="stripe4"
      class="stripe"/>
    <div
      id="smoke1"
      class="smoke">
      <div
        id="sCloud1"
        class="sCloud"/>
      <div
        id="sCloud2"
        class="sCloud"/>
      <div
        id="sCloud3"
        class="sCloud"/>
    </div>
    <div
      id="smoke2"
      class="smoke">
      <div
        id="sCloud4"
        class="sCloud"/>
      <div
        id="sCloud5"
        class="sCloud"/>
      <div
        id="sCloud6"
        class="sCloud"/>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    moveBox() {
      console.log('Hello');
      document.getElementById('package1').style.webkitAnimationPlayState = 'running';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/factory.scss';

</style>
