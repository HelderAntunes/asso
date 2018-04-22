<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <h2>Manage Subscribers</h2>
        <el-breadcrumb
          class="breadcrumb pb3"
          separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>Subscribers</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
          :data="institutions"
          class="dashboard-table">
          <el-table-column
            label="Contact info">
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top">
                <div
                  slot="reference"
                  class="name-wrapper">
                  <el-tag size="medium"> {{ scope.row.name }}</el-tag>
                </div>
                <p><b>Telephone:</b> {{ scope.row.telephone }}</p>
                <p><b>Foundation:</b> {{ scope.row.foundation_year }}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="Description">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Location">
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top">
                <p><b>Address:</b> {{ scope.row.location.address }}</p>
                <p><b>City:</b> {{ scope.row.location.city }}</p>
                <p><b>Country:</b> {{ scope.row.location.country }}</p>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
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
      subscribers: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('subscribers').all();
      this.subscribers = response.data;
    } catch (e) {
      throw (e);
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
