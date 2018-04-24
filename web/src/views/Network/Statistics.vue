<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <el-card class="box-card">
          <div
            v-for="o in 4"
            :key="o"
            class="text item">
            {{ 'List item ' + o }}
          </div>
        </el-card>
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
      statistics: [],
    };
  },
  methods: {
    async getStatistics() {
      try {
        const response = await new Proxy('overview').all();
        this.statistics = response.data;
        console.log(this.statistics);
      } catch (e) {
        throw (e);
      }
    },
  },
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

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}

</style>
