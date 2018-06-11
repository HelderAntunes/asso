<template>
  <div class="pb3">
    <el-form :model="form">
      <el-form-item
        label="Routing Key">
        <el-input
          v-model="form.key"
          placeholder="Select the topic" />
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
      form: {
        key: '',
        content: '',
        periodic: {
          isPeriodic: false,
          duration: 10000,
          interval: 1000,
        },
      },
      topics: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('api/bindings').all();
      this.topics = response.data;
    } catch (e) {
      throw e;
    }
  },
  methods: {
    clearForm() {
      Object.keys(this.form).forEach((key) => {
        if (key !== 'periodic' && key !== 'destination') {
          this.form[key] = '';
        }
      });
    },
    async sendMessage() {
      try {
        const data = this.form;
        data.publisher = this.device.name;
        const response = await new Proxy('api/messages').create(data);
        if (response.code === '200') {
          this.$message({
            message: 'Message published with success!',
            type: 'success',
          });
          this.$emit('updateMessages', response.data);
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

