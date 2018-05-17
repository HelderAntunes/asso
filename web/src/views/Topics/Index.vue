<template>
  <div>
    <div class="clearfix">
      <div
        id="side-bar"
        class="sm-col sm-col-3 lg-col-2">
        <Sidebar />
      </div>
      <div class="flex flex-column p3">
        <h2>Manage Topics</h2>
        <el-breadcrumb
          class="breadcrumb pb3"
          separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>Topics</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
          :data="topics"
          class="dashboard-table">
          <el-table-column
            label="Destination">
            <template slot-scope="scope">
              <span>{{ scope.row.destination }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Arguments">
            <template slot-scope="scope">
              <span>{{ scope.row.arguments }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Operations">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'topics.show', params: {id: scope.row.destination} }">
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
            @click="onClickCreate">Create Topic</el-button>
        </div>
        <el-dialog
          v-if="dialog.action === 'DELETE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-alert
            title="Permanent action"
            type="warning"
            description="Do you really want to delete this topic?"
            show-icon/>
          <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="dialog.visible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="deleteTopic">Confirm</el-button>
          </span>
        </el-dialog>
        <el-dialog
          v-if="dialog.action === 'CREATE'"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          width="50%">
          <el-form :model="form">
            <el-form-item label="Topic name">
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
              @click="createTopic">Confirm</el-button>
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
      topic: {},
      form: {
        name: '',
      },
      dialog: {
        title: '',
        visible: false,
        action: '',
      },
      topics: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('topics').all();
      this.topics = response;
    } catch (e) {
      throw e;
    }
  },
  methods: {
    onClickCreate() {
      this.dialog.action = 'CREATE';
      this.dialog.title = 'Create Topic';
      this.dialog.visible = true;
    },
    async createTopic() {
      try {
        const name = this.form.name;
        const result = await new Proxy('topics').create({ name });

        if (result.statusCode === 201) {
          this.topics.push({ destination: name, arguments: {} });
          this.dialog.visible = false;

          this.$message({
            message: `Topic ${name} created with success!`,
            type: 'success',
          });
        } else {
          this.$message({
            message: `Topic ${name} was not created!`,
            type: 'error',
          });
        }
      } catch (e) {
        throw e;
      }
    },
    onClickDelete(topic) {
      this.dialog.action = 'DELETE';
      this.dialog.title = 'Delete Topic';
      this.dialog.visible = true;
      this.topic = topic;
    },
    async deleteTopic() {
      try {
        const response = await new Proxy('topics').destroy(this.topic.destination);
        if (response.result === 'Success') {
          this.topics.splice(
            this.topics.findIndex(x => x.destination === this.topic.destination),
            1,
          );
          this.$message({
            message: `Topic ${this.topic.destination} deleted with success!`,
            type: 'success',
          });
          this.topic = null;
          this.dialog.visible = false;
        } else {
          this.$message({
            message: `Topic ${this.topic.destination} was not deleted!`,
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
