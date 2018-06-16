<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <h2>Manage Queues</h2>
        <el-breadcrumb
          class="breadcrumb pb3"
          separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>Queues</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pb3">
          <h4>
            Message Settings
          </h4>
          <h5>
            Mode
          </h5>
          <el-radio-group
            v-model="settings"
            @change="changeMessageSettings">
            <el-radio label="AUTOMATIC">Automatic delivery</el-radio>
            <el-radio label="MANUAL">Manual delivery</el-radio>
          </el-radio-group>
          <div v-if="settings === 'AUTOMATIC'">
            <h5>
              Deliver speed
            </h5>
            <el-select
              v-model="speed"
              placeholder="Select the message's deliver speed"
              @change="changeMessageSettings">
              <el-option
                v-for="interval in [1000, 2500, 5000, 7500, 10000]"
                :key="interval"
                :label="interval"
                :value="interval"/>
            </el-select>
          </div>
        </div>
        <el-table
          :data="queues"
          class="dashboard-table">
          <template slot="empty">
            <span>There are no queues to be listed</span>
          </template>
          <el-table-column
            label="Queue">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Bindings">
            <template slot-scope="scope">
              <span>{{ showBindings(scope.row.bindings) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Messages">
            <template slot-scope="scope">
              <span>{{ scope.row.messages }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Operations">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'queues.show', params: {id: scope.row.name} }">
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
            @click="onClickCreate">Create Queue</el-button>
        </div>
        <el-dialog
          v-if="dialog.action === 'DELETE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-alert
            title="Permanent action"
            type="warning"
            description="Do you really want to delete this queue?"
            show-icon/>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="deleteQueue">Confirm</el-button>
          </span>
        </el-dialog>
        <el-dialog
          v-if="dialog.action === 'CREATE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-form
            :model="form">
            <el-form-item label="Name">
              <el-input
                v-model="form.name"
                auto-complete="off"/>
            </el-form-item>
            <el-form-item label="Bindings">
              <br>
              <el-select
                v-model="form.bindings"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Choose bindings for the queue"
                style="width:100%">
                <el-option
                  v-for="bind in bindings"
                  :key="bind.destination"
                  :label="bind.routing_key"
                  :value="bind.routing_key"/>
              </el-select>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="createQueue">Confirm</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar';
import Proxy from '@/proxies/Proxy';
import store from '@/store';
import { mapState } from 'vuex';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      queue: {},
      form: {
        name: '',
        bindings: [],
      },
      dialog: {
        title: '',
        visible: false,
        action: '',
      },
      queues: [],
      bindings: [],
      settings: '',
      speed: 2500,
    };
  },
  computed: {
    ...mapState({
      messageSettings: state => state.config.message,
      speedSettings: state => state.config.speed,
    }),
  },
  async created() {
    try {
      let response = await new Proxy('api/queues').all();
      this.queues = response.data.filter(x => x.name !== 'proxy');
      response = await new Proxy('api/bindings').all();
      this.bindings = (response.data).filter(x => x.source === 'source');
      this.settings = this.messageSettings;
      this.speed = this.speedSettings;
    } catch (e) {
      throw e;
    }
  },
  methods: {
    changeMessageSettings() {
      store.dispatch('config/update', { settings: this.settings, speed: this.speed });
    },
    showBindings(bindings) {
      return bindings.map(x => x.routing_key).join(', ');
    },
    onClickCreate() {
      this.dialog.action = 'CREATE';
      this.dialog.title = 'Create Queue';
      this.dialog.visible = true;
    },
    async createQueue() {
      try {
        const name = this.form.name;
        const bindings = this.form.bindings;
        const response = await new Proxy('api/queues').create({
          name,
          bindings,
        });

        if (response.code === '200') {
          this.queues.push({ ...response.data, messages: 0 });
          this.dialog.visible = false;

          this.$message({
            message: `Queue ${name} created with success!`,
            type: 'success',
          });
        } else {
          this.$message({
            message: `Queue ${name} was not created!`,
            type: 'error',
          });
        }
      } catch (e) {
        throw e;
      }
    },
    onClickDelete(queue) {
      this.dialog.action = 'DELETE';
      this.dialog.title = 'Delete Queue';
      this.dialog.visible = true;
      this.queue = queue;
    },
    async deleteQueue() {
      try {
        const response = await new Proxy('api/queues').destroy(this.queue.name);
        if (response.code === '200') {
          this.queues.splice(
            this.queues.findIndex(x => x.name === this.queue.name),
            1,
          );
          this.$message({
            message: `Queue ${this.queue.name} deleted with success!`,
            type: 'success',
          });
          this.queue = null;
          this.dialog.visible = false;
        } else {
          this.$message({
            message: `Queue ${this.queue.name} was not deleted!`,
            type: 'error',
          });
        }
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
