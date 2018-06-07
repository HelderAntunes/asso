<template>
  <div class="pb3">
    <el-radio
      v-model="messageType"
      label="direct">Direct Message</el-radio>
    <el-radio
      v-model="messageType"
      label="topic">Topic Message</el-radio>
    <el-form :model="form">
      <el-form-item
        v-if="messageType === 'topic'"
        label="Topic">
        <el-select
          v-model="form.topic"
          placeholder="Select the topic"
          style="width: 100%">
          <el-option
            v-for="topic in topics"
            :key="topic.destination"
            :label="topic.destination"
            :value="topic.destination"/>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="messageType === 'direct'"
        label="Receiver">
        <el-select
          v-model="form.receiver"
          placeholder="Select the device"
          style="width: 100%">
          <el-option
            v-for="device in devices"
            :key="device.name"
            :label="device.name"
            :value="device.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Periodic Message">
        <el-switch v-model="form.periodic.isPeriodic"/>
      </el-form-item>
      <el-form-item
        v-if="form.periodic.isPeriodic"
        label="Duration">
        <el-input v-model="form.periodic.duration"/>
      </el-form-item>
      <el-form-item
        v-if="form.periodic.isPeriodic"
        label="Periodicity">
        <el-select
          v-model="form.periodic.interval"
          placeholder="Select the message periodicity">
          <el-option
            v-for="interval in [1000, 2000, 3000, 4000, 5000]"
            :key="interval"
            :label="interval"
            :value="interval"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Message">
        <el-input
          v-model="form.content"
          auto-complete="off"/>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="clearForm">Clear</el-button>
      <el-button
        type="primary"
        @click="sendMessage">Send</el-button>
    </span>
  </div>
</template>

<script>
import Proxy from '@/proxies/Proxy';

export default {
  props: {
    device: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      messageType: 'topic',
      form: {
        topic: '',
        content: '',
        periodic: {
          isPeriodic: false,
          duration: 10000,
          interval: 1000,
        },
        receiver: '',
      },
      topics: [],
      devices: [],
    };
  },
  async created() {
    try {
      let response = await new Proxy('api/bindings').all();
      this.topics = response.data;
      response = await new Proxy('api/devices').all();
      this.devices = response.data.filter(x => x.name !== this.device.name);
    } catch (e) {
      throw e;
    }
  },
  methods: {
    clearForm() {
      Object.keys(this.form).forEach((key) => {
        if (key !== 'periodic') {
          this.form[key] = '';
        }
      });
    },
    async sendMessage() {
      try {
        const response = await new Proxy('api/messages').create(this.form);
        if (response.code === '200') {
          this.$message({
            message: 'Message published with success!',
            type: 'success',
          });
          this.clearForm();
        }
      } catch (e) {
        this.$message({
          message: 'Error sending message!',
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

