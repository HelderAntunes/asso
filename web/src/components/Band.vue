<template>
  <div class="mx-auto">
    <div
      id="stand1"
      class="stand"/>
    <div
      id="stand2"
      class="stand"/>
    <div
      id="stand3"
      class="stand"/>
    <div
      id="stand4"
      class="stand"/>
    <div
      id="band">
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
      <div
        id="wheel5"
        class="wheel"/>
      <div
        id="wheel6"
        class="wheel"/>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@-webkit-keyframes goWheels {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.stand {
  width: 1em;
  height: 13px;
  position: absolute;
  background-color: #bcbec0;
  top: 279px;
}

#stand1 {
  left: 195px;
}
#stand2 {
  left: 257px;
}

#stand3 {
  left: 319px;
}
#stand4 {
  left: 381px;
}

#band {
  width: 250px;
  height: 13px;
  border-radius: 10px;
  position: absolute;
  background-color: #58595b;
  top: 266px;
  left: 175px;
}

.wheel {
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: #414042;
  position: absolute;
  /*-webkit-animation: goWheels 0.5s linear infinite normal;*/
}

.wheel:after {
  content: "";
  display: block;
  width: 12px;
  height: 2px;
  background-color: #f5f19a;
  position: absolute;
  top: 5px;
}

#wheel1 {
  left: 20px;
  -webkit-animation: goWheels 0.5s 0.1s linear infinite normal;
}
#wheel2 {
  left: 60px;
  -webkit-animation: goWheels 0.5s 0.2s linear infinite normal;
}
#wheel3 {
  left: 100px;
  -webkit-animation: goWheels 0.5s 0.3s linear infinite normal;
}
#wheel4 {
  left: 140px;
  -webkit-animation: goWheels 0.5s 0.4s linear infinite normal;
}

#wheel5 {
  left: 180px;
  -webkit-animation: goWheels 0.5s 0.3s linear infinite normal;
}
#wheel6 {
  left: 220px;
  -webkit-animation: goWheels 0.5s 0.4s linear infinite normal;
}
</style>
