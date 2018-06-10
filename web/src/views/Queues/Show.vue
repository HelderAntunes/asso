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
          <el-alert
            title="The logic behind the topic exchange is similar to a direct one -
            a message sent with a particular routing key will be delivered to all the
            queues that are bound with a matching binding key."
            type="info"
            show-icon/>
          <br>
          <el-alert
            title="When a queue is bound with '#' (hash) binding key -
            it will receive all the messages, regardless of the routing key"
            type="info"
            show-icon/>
          <span v-if="queue.bindings.length === 0">
            No bindings for this queue
          </span>
          <br>
          <el-tag
            v-for="bind in queue.bindings"
            :key="bind.destination"
            :disable-transitions="false"
            closable
            class="ml2"
            @close="removeBind(bind)">
            {{ bind.destination }}
          </el-tag>
          <br>
          <el-input
            v-if="inputVisible"
            ref="saveBindingInput"
            v-model="newBinding"
            class="ml2 pt2"
            size="mini"
            @keyup.enter.native="addBinding"
            @blur="addBinding"/>
          <el-button
            v-else
            class="button-new-tag ml2 mt2"
            primary
            @click="showInput">+ New Binding</el-button>
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
      queue: {
        bindings: [],
      },
      messages: [],
      inputVisible: false,
      newBinding: '',
    };
  },
  async created() {
    try {
      let response = await new Proxy('api/queues').find(this.$route.params.id);
      this.queue = response.data;
      response = await new Proxy().submit(
        'get',
        `api/queues/${this.queue.name}/messages`,
      );
      this.messages = response.data;
    } catch (e) {
      this.$message({
        message: 'Error retrieving queue!',
        type: 'error',
      });
    }
  },
  methods: {
    async removeBinding(binding) {
      try {
        const response = await new Proxy().submit(
          'delete',
          `api/queues/${this.queue.name}/bindings/${binding.destination}`,
        );
        if (response.code === '200') {
          this.queue.bindings.splice(
            this.queue.bindings.indexOf(binding),
            1,
          );
        }
      } catch (e) {
        throw e;
      }
    },

    showInput() {
      this.inputVisible = true;
    },

    async addBinding() {
      if (this.newBinding) {
        try {
          const response = await new Proxy().submit(
            'post',
            `api/queues/${this.queue.name}/bindings/${
              this.newBinding
            }`,
          );
          if (response.code === '200') {
            const index = this.queue.bindings.findIndex(
              x => x.destination === this.newBinding,
            );
            if (index === -1) {
              this.queue.bindings.push({ destination: this.newBinding });
            }
            this.inputVisible = false;
            this.newBinding = '';
          }
        } catch (e) {
          throw e;
        }
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
