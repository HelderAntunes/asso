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
          :data="subscribers"
          class="dashboard-table">
          <el-table-column
            label="Name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Bindings">
            <template slot-scope="scope">
              <el-popover
                placement="top">
                <ul>
                  <li
                    v-for="(value, key) in scope.row.bindings[0]"
                    :key="key">
                    {{ key }} : {{ value }}
                  </li>
                </ul>
                <el-button slot="reference">Show</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="Operations">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'subscribers.show', params: {id: scope.row.name} }">
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
            @click="onClickCreate">Create Subscriber</el-button>
        </div>
        <el-dialog
          v-if="dialog.action === 'DELETE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-alert
            title="Permanent action"
            type="warning"
            description="Do you really want to delete this subscriber?"
            show-icon/>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="deleteSubscriber">Confirm</el-button>
          </span>
        </el-dialog>
        <el-dialog
          v-if="dialog.action === 'CREATE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-form :model="form">
            <el-form-item label="Subscriber name">
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
              @click="createSubscriber">Confirm</el-button>
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
      subscriber: {},
      form: {
        name: '',
      },
      dialog: {
        title: '',
        visible: false,
        action: '',
      },
      subscribers: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('subscribers').all();
      this.subscribers = response.map(x => ({
        name: x.name,
        bindings: x.bindings,
      }));
    } catch (e) {
      throw e;
    }
  },
  methods: {
    onClickCreate() {
      this.dialog.action = 'CREATE';
      this.dialog.title = 'Create Subscriber';
      this.dialog.visible = true;
    },
    async createSubscriber() {
      try {
        const name = this.form.name;
        const result = await new Proxy('subscribers').create({ name });
        console.log(result);
        this.subscribers.push({ name, bindings: [] });
        this.dialog.visible = false;

        this.$message({
          message: `Subscriber ${name} created with success!`,
          type: 'success',
        });
      } catch (e) {
        throw e;
      }
    },
    onClickDelete(subscriber) {
      this.dialog.action = 'DELETE';
      this.dialog.title = 'Delete Subscriber';
      this.dialog.visible = true;
      this.subscriber = subscriber;
    },
    async deleteSubscriber() {
      try {
        const response = await new Proxy('subscribers').destroy(this.subscriber.name);
        console.log(response);
        this.subscribers.splice(
          this.subscribers.findIndex(x => x.name === this.subscriber.name),
          1,
        );
        this.$message({
          message: `Subcriber ${this.subscriber.name} deleted with success!`,
          type: 'success',
        });
        this.topic = null;
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

