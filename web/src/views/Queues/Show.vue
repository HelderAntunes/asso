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
          <br>
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
            @close="removeBinding(bind)">
            {{ bind.routing_key }}
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
        <div id="messages">
          <h3>
            Messages
          </h3>
          <factory />
          <truck />
          <band />
          <div id="cube" />
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
import Factory from '@/components/Factory';
import Truck from '@/components/Truck';
import Band from '@/components/Band';
import Proxy from '@/proxies/Proxy';

export default {
  components: {
    Sidebar,
    Factory,
    Truck,
    Band,
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

      this.$options.sockets.routing_key_message = (message) => {
        const routingKey = message.fields.routingKey;

        // See if message's routing key corresponds to one of the bindings
        const match = this.matchKey(routingKey);

        if (match) {
          // Just testing. Later change this to after animation
          const enc = new TextDecoder('utf-8');
          this.$socket.emit('publish_message', {
            publisher: message.properties.appId,
            key: message.fields.routingKey,
            content: enc.decode(message.content),
          });
        }
      };
    } catch (e) {
      this.$message({
        message: 'Error retrieving queue!',
        type: 'error',
      });
    }
  },
  methods: {
    matchKey(routingKey) {
      return (this.queue.bindings).some((x) => {
        let pattern = x.routing_key.replace(/\*/i, '\\w*');
        pattern = pattern.replace(/#/i, '\\S*');
        pattern = new RegExp(`^${pattern}$`, 'g');

        return pattern.test(routingKey);
      });
    },
    async removeBinding(binding) {
      try {
        const response = await new Proxy().submit(
          'delete',
          `api/queues/${this.queue.name}/bindings/${encodeURIComponent(binding.routing_key)}`,
        );
        if (response.code === '200') {
          this.queue.bindings.splice(this.queue.bindings.indexOf(binding), 1);
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
          const bind = encodeURIComponent(this.newBinding);
          const response = await new Proxy().submit(
            'post',
            `api/queues/${this.queue.name}/bindings/${bind}`,
          );
          if (response.code === '200') {
            const index = this.queue.bindings.findIndex(
              x => x.routing_key === this.newBinding,
            );
            if (index === -1) {
              this.queue.bindings.push({ routing_key: this.newBinding });
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

#cube {
  width: 50px;
  height: 26px;
  position: absolute;
  background-color: brown;
  left: 858px ;
  top: 740px;
}

#messages {
  height: 400px;
}
</style>
