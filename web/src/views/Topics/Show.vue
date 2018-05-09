<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <h2>Manage {{ $route.params.id }}</h2>
        <el-breadcrumb
          class="breadcrumb pb3"
          separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'topics' }">Topics</el-breadcrumb-item>
          <el-breadcrumb-item>Topic {{ $route.params.id }}</el-breadcrumb-item>
        </el-breadcrumb>

      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar';
import Proxy from '@/proxies/Proxy';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      topic: null,
    };
  },
  async created() {
    try {
      const response = await new Proxy('topics').all();
      this.topic = response;
    } catch (e) {
      throw e;
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#side-bar {
  border-right: solid 1px #e6e6e6;
  height: 100vh;
}

.dashboard-table {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  padding: 10px;
  min-height: 60%;
}
</style>
