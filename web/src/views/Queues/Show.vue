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
          <el-breadcrumb-item :to="{ name: 'queues' }">Queues</el-breadcrumb-item>
          <el-breadcrumb-item>Queue {{ $route.params.id }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="">
          <h3>Topics and Routing</h3>
        </div>
        <div>
          <h3>
            Messages
          </h3>
        </div>
        <div>
          <h3>
            Queue configurations
          </h3>
          <tree-view
            :data="queue"
            :options="{maxDepth: 3}"/>
        </div>
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
      queue: null,
    };
  },
  async created() {
    try {
      const response = await new Proxy('api/queues').find(
        this.$route.params.id,
      );
      this.queue = response;
    } catch (e) {
      this.$message({
        message: 'Error retrieving queue!',
        type: 'error',
      });
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
