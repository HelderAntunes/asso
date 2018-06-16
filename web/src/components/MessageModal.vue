<template>
  <el-dialog
    :visible.sync="showModal"
    :title="`${action} Message`">
    <el-form :model="message">
      <el-form-item label="Content">
        <el-input v-model="message.content"/>
      </el-form-item>
      <el-form-item label="Topic">
        <el-input v-model="message.topic"/>
      </el-form-item>
      <el-form-item label="Publisher">
        <el-select
          v-model="message.publisher"
          placeholder="Please select the publisher"
          style="width: 100%">
          <el-option
            v-for="device in devices"
            :key="device.id"
            :label="device.name"
            :value="device.name"/>
        </el-select>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="closeModal">Cancel</el-button>
      <el-button
        type="danger"
        plain
        @click="deleteMessage">Delete Message</el-button>
      <el-button
        type="primary"
        plain
        @click="submitAction">{{ action }} Message</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Proxy from '@/proxies/Proxy';
import store from '@/store';
import { mapState } from 'vuex';

export default {
  name: 'MessageModal',
  props: {
    data: {
      type: Object,
      default: null,
    },
    modalAction: {
      type: String,
      default: 'CREATE',
    },
  },
  data() {
    return {
      componentMounted: false,
      message: {
        content: '',
        publisher: '',
        topic: '',
        state: '',
      },
      devices: [],
    };
  },
  computed: {
    ...mapState('queue', ['visible', 'modal', 'action']),
    showModal() {
      if (
        this.$options.name === this.modal &&
        this.action === 'UPDATE' &&
        this.visible &&
        this.componentMounted
      ) {
        this.verifyAction();
        return true;
      }
      return false;
    },
  },
  async mounted() {
    try {
      const response = await new Proxy('api/devices').all();
      this.devices = response.data;
    } catch (e) {
      throw e;
    }
    this.componentMounted = true;
  },
  methods: {
    closeModal() {
      this.message.state = 'OnQueue';
      this.$emit('updateMessage', this.message);
      store.dispatch('queue/hide');
    },
    deleteMessage() {
      this.$emit('deleteMessage', this.message);
      this.closeModal();
    },
    async submitAction() {
      try {
        const response = await new Proxy('api/messages').create(this.message);
        if (response.status.code === '200') {
          this.$message({
            message: 'Message sent with success!',
            type: 'success',
          });
        }
      } catch (e) {
        this.$message({
          message: 'Error sending message!',
          type: 'error',
        });
      }

      this.closeModal();
    },
    verifyAction() {
      if (this.action === 'UPDATE') {
        this.message = { ...this.data };
      } else {
        this.message = {
          publisher: '',
          content: '',
          key: '',
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
