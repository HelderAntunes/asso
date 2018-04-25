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
          <h2>Channels</h2>
          <div
            class="text item">
            <p
              v-if= "statistics.object_totals"
              class="item_value">
              {{ statistics.object_totals.channels }}
            </p>
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
      statistics: {},
    };
  },
  created() {
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      console.log('statistics');
      try {
        const response = await new Proxy('overview').all();
        this.statistics = response;
        console.log(this.statistics);
      } catch (error) {
        console.error(error);
        throw (error);
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

.item_value {
  font-size: 2em;
  margin-top: 0px;
  margin-bottom: 0px;
  text-align: right;
}

.box-card{
  width: 200px;
}
</style>
