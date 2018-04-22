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
            Network View
          </el-menu-item>
          <el-menu-item
            index="1-2">
            Something
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <template slot="title">
          <i class="fas fa-mobile"/>
          <span>Subscribers</span>
        </template>
      </el-menu-item>
      <el-menu-item index="3">
        <template slot="title">
          <i class="fas fa-comment"/>
          <span>Topics</span>
        </template>
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

.el-menu, .el-sub-menu, .el-menu-item-group{
  border: none !important;
}

i{
  font-size: 1.2em;
  padding-right: 10px;
}

.profile{
  padding: 40px 20px 20px 20px;
  text-align: center;

  #profile-name{
    padding-top: 20px;
  }

  #profile-picture img{
  width: 40%;
  border-radius: 50%;
}
}
</style>
