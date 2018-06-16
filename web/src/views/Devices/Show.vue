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
          <el-breadcrumb-item :to="{ name: 'devices' }">Devices</el-breadcrumb-item>
          <el-breadcrumb-item>Device {{ $route.params.id }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
          <div class="col md-col-12">
            <div class="col md-col-6">
              <h3>
                Publish
              </h3>
              <publish-form
                :device="device"
                @updateMessages="updateMessages" />
            </div>
            <div class="col md-col-6 pl2">
              <h3>
                Subscriptions
              </h3>
              <span v-if="device.subscriptions.length === 0">
                No subscriptions for this device
              </span>
              <el-tag
                v-for="subscription in device.subscriptions"
                :key="subscription.queue + ' - ' + subscription.topic"
                :disable-transitions="false"
                closable
                class="ml2"
                @close="removeSubscription(subscription)">
                {{ subscription.queue + ' - ' + subscription.topic }}
              </el-tag>
              <br>
              <el-select
                v-if="inputVisible"
                ref="saveSubscriptionInput"
                v-model="newSubscription"
                class="ml2 mt2"
                filterable
                allow-create
                default-first-option
                placeholder="Choose topics of interest"
                @keyup.enter.native="addSubscription"
                @blur="addSubscription">
                <el-option
                  v-for="item in bindings"
                  :key="item.destination + '-' + item.routing_key"
                  :label="item.destination + ' - ' + item.routing_key"
                  :value="item.destination + '-' + item.routing_key"/>
              </el-select>
              <el-button
                v-else
                class="button-new-tag ml2 mt2"
                primary
                @click="showInput">+ New Subscription</el-button>
            </div>
          </div>
        </div>
        <div>
          <h3>
            Messages
          </h3>
          <div class="col md-col-6">
            <h4>
              Sent
            </h4>
            <div class="mx2 mr3">
              <el-card
                v-for="message in sentMessages"
                :key="message._id"
                class="box-card mb2">
                <div
                  slot="header"
                  class="clearfix">
                  <span>Routing Key: {{ message.key }}</span>
                  <el-button
                    class="right"
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    circle
                    @click="deleteMessage(message)"/>
                </div>
                <div>
                  <span>
                    {{ message.content }}
                  </span>
                </div>
              </el-card>
            </div>
          </div>
          <div class="col md-col-6">
            <h4>
              Received
            </h4>
            <div class="mx2 mr3">
              <el-card
                v-for="message in consumedMessages"
                :key="message._id"
                class="box-card">
                <div
                  slot="header"
                  class="clearfix">
                  <span>Routing Key: {{ message.fields.routingKey }}</span>
                  <el-button
                    class="right"
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    circle
                    @click="deleteMessage(message)"/>
                </div>
                <div>
                  <span>
                    {{ message.content }}
                  </span>
                  <div class="mt2 right-align">
                    <span style="color: grey">
                      Sent by {{ message.properties.appId }}
                    </span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar';
import Proxy from '@/proxies/Proxy';
import PublishForm from './PublishForm';

export default {
  components: {
    Sidebar,
    PublishForm,
  },
  data() {
    return {
      inputVisible: false,
      bindings: [],
      newSubscription: '',
      device: {
        subscriptions: [],
      },
      consumedMessages: [],
      sentMessages: [],
    };
  },
  async created() {
    try {
      let response = await new Proxy('api/devices').find(this.$route.params.id);
      this.device = { ...this.device, ...response.data };
      response = await new Proxy('api/bindings').all();
      this.bindings = (response.data).filter(x => x.source === 'source');
      const deviceName = encodeURIComponent(this.device.name.trim());
      response = await new Proxy().submit(
        'get',
        `api/messages?publisher=${deviceName}`,
      );
      this.sentMessages = response.data;
      response = await new Proxy().submit(
        'get',
        `api/messages?destination.receiver=${deviceName}`,
      );
      this.consumedMessages = response.data;
      const identifier = (this.$route.params.id).replace(/[^A-Z0-9]/ig, '_');

      this.$options.sockets[`message_${identifier}`] = (message) => {
        this.consumedMessages.push(message);
      };
    } catch (e) {
      throw e;
    }
  },
  methods: {
    async deleteMessage(message) {
      let index = this.consumedMessages.findIndex(x => x._id === message._id);
      if (index === -1) {
        index = this.sentMessages.findIndex(x => x._id === message._id);
        this.sentMessages.splice(index, 1);
      } else {
        this.consumedMessages.splice(index, 1);
      }
      try {
        await new Proxy().submit(
          'delete',
          `api/messages/${message._id}`,
        );
      } catch (e) {
        throw (e);
      }
    },
    updateMessages(message) {
      this.sentMessages.push(message);
    },
    async removeSubscription(subscription) {
      try {
        const response = await new Proxy().submit(
          'post',
          `api/devices/${this.device.name}/subscriptions/delete`,
          subscription,
        );
        if (response.code === '200') {
          this.device.subscriptions.splice(
            this.device.subscriptions.indexOf(subscription),
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

    async addSubscription() {
      if (this.newSubscription) {
        const values = this.newSubscription.split('-');
        let queue = 'Custom';
        let topic = '';
        if (values.length === 2) {
          queue = values[0];
          topic = values[1];
        } else {
          topic = this.newSubscription;
        }
        try {
          const response = await new Proxy().submit(
            'post',
            `api/devices/${this.device.name}/subscriptions`,
            { queue, topic },
          );
          if (response.code === '200') {
            const index = this.device.subscriptions.findIndex(x => x === this.newSubscription);
            if (index === -1) { this.device.subscriptions.push(response.data); }
            this.inputVisible = false;
            this.newSubscription = '';
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
