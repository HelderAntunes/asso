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
            label="Name">
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
                @click="onClickDelete"/>
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
              @click="dialog.visible = false">Confirm</el-button>
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
              @click="dialog.visible = false">Confirm</el-button>
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
    onClickDelete() {
      this.dialog.action = 'DELETE';
      this.dialog.title = 'Delete Topic';
      this.dialog.visible = true;
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
