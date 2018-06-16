<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <h2>Manage Devices</h2>
        <el-breadcrumb
          class="breadcrumb pb3"
          separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>Devices</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
          :data="devices"
          class="dashboard-table">
          <template slot="empty">
            <span>There are no queues to be listed</span>
          </template>
          <el-table-column
            label="Name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Operations">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'devices.show', params: {id: scope.row.name} }">
                <el-button
                  icon="el-icon-search"
                  circle/>
              </router-link>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="onClickDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <div class="pt2">
          <el-button
            type="primary"
            @click="onClickCreate">Create Device</el-button>
          <el-button
            type="primary"
            @click="seedDevices">Seed Devices</el-button>
        </div>
        <el-dialog
          v-if="dialog.action === 'DELETE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-alert
            title="Permanent action"
            type="warning"
            description="Do you really want to delete this device?"
            show-icon/>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="deleteDevice">Confirm</el-button>
          </span>
        </el-dialog>
        <el-dialog
          v-if="dialog.action === 'CREATE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-form :model="form">
            <el-form-item label="Device name">
              <el-input
                v-model="form.name"
                auto-complete="off"/>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="createDevice">Confirm</el-button>
          </span>
        </el-dialog>
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
      device: {},
      form: {
        name: '',
      },
      dialog: {
        title: '',
        visible: false,
        action: '',
      },
      devices: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('api/devices').all();
      this.devices = response.data;
    } catch (e) {
      throw e;
    }
  },
  methods: {
    async seedDevices() {
      try {
        await new Proxy().submit(
          'get',
          'api/devices/seed',
        );
        this.$message({
          message: 'Devices seeded with success!',
          type: 'success',
        });
      } catch (e) {
        throw e;
      }
    },
    onClickCreate() {
      this.dialog.action = 'CREATE';
      this.dialog.title = 'Create Device';
      this.dialog.visible = true;
    },
    async createDevice() {
      try {
        const name = this.form.name;
        await new Proxy('api/devices').create({ name });
        this.devices.push({ name });
        this.dialog.visible = false;

        this.$message({
          message: `Device ${name} created with success!`,
          type: 'success',
        });
      } catch (e) {
        throw e;
      }
    },
    onClickDelete(device) {
      this.dialog.action = 'DELETE';
      this.dialog.title = 'Delete device';
      this.dialog.visible = true;
      this.device = device;
    },
    async deleteDevice() {
      try {
        await new Proxy('api/devices').destroy(this.device.name);
        this.devices.splice(
          this.devices.findIndex(x => x.name === this.device.name),
          1,
        );
        this.$message({
          message: `Device ${this.device.name} deleted with success!`,
          type: 'success',
        });
        this.device = null;
        this.dialog.visible = false;
      } catch (e) {
        throw e;
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
</style>
