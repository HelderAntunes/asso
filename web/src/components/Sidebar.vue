<template>
  <div>
    <el-menu
      default-active="2"
      class="dashboard-menu">
      <div class="profile">
        <div id="profile-name"><span>Hello, guys!</span></div>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <i class="fas fa-university"/>
          <span>Network</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            index="1-1">
            <router-link
              :to="{ name: 'network.tree' }"
              class="link" >
              <span>Network View</span>
            </router-link>
          </el-menu-item>
          <el-menu-item
            index="1-2">
            <router-link
              :to="{ name: 'network.statistics' }"
              class="link" >
              <span>Statistics</span>
            </router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item
        index="2">
        <router-link
          :to="{ name: 'devices' }"
          class="link">
          <i class="fas fa-mobile"/>
          <span>Devices</span>
        </router-link>
      </el-menu-item>
      <el-menu-item
        index="3">
        <router-link
          :to="{ name: 'topics' }"
          class="link">
          <i class="fas fa-comment"/>
          <span>Topics</span>
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-menu,
.el-sub-menu,
.el-menu-item-group {
  border: none !important;
}

i {
  font-size: 1.2em;
  padding-right: 10px;
}

.profile {
  padding: 40px 20px 20px 20px;
  text-align: center;

  #profile-name {
    padding-top: 20px;
  }

  #profile-picture img {
    width: 40%;
    border-radius: 50%;
  }
}

.link,
.link:active,
.link:visited {
  text-decoration: none;
  color: #666768;
  display: block;
}

</style>
