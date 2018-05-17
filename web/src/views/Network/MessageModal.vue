<template>
  <div>
    <el-form :model="form">
      <el-form-item label="Publisher">
        <el-input
          v-model="form.publisher"
          auto-complete="off"/>
      </el-form-item>
      <el-form-item label="Topic">
        <el-select v-model="form.topic" placeholder="Please, select the desired topic" style="width: 100%">
          <el-option v-for="topic in topics" :key="topic.destination" :label="topic.destination" :value="topic.destination"></el-option>
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
      <el-button @click="dialog.visible = false">Cancel</el-button>
      <el-button
        type="primary"
        @click="sendMessage">Confirm</el-button>
    </span>
  </div>
</template>

<script>
import Proxy from '@/proxies/Proxy';

export default {
  name: 'MessageModal',
  props: {
    topics: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      form: {
        content: '',
        topic: '',
        publisher: '',
      },
    };
  },
  methods: {
    async sendMessage() {
      try {
        const response = await new Proxy('messages').create(this.form);
        console.log(response);
        this.$message({
          message: 'Message sent with success!',
          type: 'success',
        });
        this.form.content = '';
        this.form.topic = '';
        this.form.publisher = '';
        this.$emit('closeModal');
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

<style lang="scss" scoped></style>
