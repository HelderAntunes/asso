<template>
  <div class="container-fluid container">
    <div class="">
      <div
        id="side-bar"
        class="sm-col sm-col-12 lg-col-2">
        <Sidebar />
      </div>

      <div>
        <input
          v-model="message.sent"
          placeholder="Send a message">
        <button @click="pingServer()">Ping Server</button>
        <p>Message from server: "{{ message.received }}"</p>
      </div>
      <!--div class="panel panel-default">
        <div class="panel-heading">Props</div>

        <div class="panel-body">
          <div class="form-horizontal">

            <div class="form-group">
              <label
                for="type"
                class="control-label col-sm-3">type</label>
              <div class="col-sm-9">
                <select
                  id="type"
                  v-model="type"
                  class="form-control">
                  <option>tree</option>
                  <option>cluster</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label
                for="layout-type"
                class="control-label col-sm-3">layoutType</label>
              <div class="col-sm-9">
                <select
                  id="layout-type"
                  v-model="layoutType"
                  class="form-control">
                  <option>euclidean</option>
                  <option>circular</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label
                for="margin-x"
                class="control-label col-sm-3">marginx</label>
              <div class="col-sm-7">
                <input
                  id="margin-x"
                  v-model.number="Marginx"
                  class="form-control"
                  type="range"
                  min="-200"
                  max="200">
              </div>
              <div class="col-sm-2">
                <p>{{ Marginx }}px</p>
              </div>
            </div>

            <div class="form-group">
              <label
                for="margin-y"
                class="control-label col-sm-3">marginy</label>
              <div class="col-sm-7">
                <input
                  id="margin-y"
                  v-model.number="Marginy"
                  class="form-control"
                  type="range"
                  min="-200"
                  max="200">
              </div>
              <div class="col-sm-2">
                <p>{{ Marginy }}px</p>
              </div>
            </div>

            <div class="form-group">
              <label
                for="margin-y"
                class="control-label col-sm-3">radius</label>
              <div class="col-sm-7">
                <input
                  id="margin-y"
                  v-model.number="radius"
                  class="form-control"
                  type="range"
                  min="1"
                  max="10">
              </div>
              <div class="col-sm-2">
                <p>{{ radius }}px</p>
              </div>
            </div>

            <div class="form-group">
              <label
                for="velocity"
                class="control-label col-sm-3">Duration</label>
              <div class="col-sm-7">
                <input
                  id="velocity"
                  v-model.number="duration"
                  class="form-control"
                  type="range"
                  min="0"
                  max="3000">
              </div>
              <div class="col-sm-2">
                <p>{{ duration }}ms</p>
              </div>
            </div>

            <div class="form-group">
              <span v-if="currentNode">Current Node: {{ currentNode.data.text }}</span>
              <span v-else>No Node selected.</span>
              <i
                v-if="isLoading"
                class="fa fa-spinner fa-spin fa-2x fa-fw"/>
            </div>

            <button
              :disabled="!currentNode"
              type="button"
              class="btn btn-primary"
              data-toggle="tooltip"
              data-placement="top"
              title="Expand All from current"
              @click="expandAll">
              <i
                class="fa fa-expand"
                aria-hidden="true"/>
            </button>

            <button
              :disabled="!currentNode"
              type="button"
              class="btn btn-secondary"
              data-toggle="tooltip"
              data-placement="top"
              title="Collapse All from current"
              @click="collapseAll">
              <i
                class="fa fa-compress"
                aria-hidden="true"/>
            </button>

            <button
              :disabled="!currentNode"
              type="button"
              class="btn btn-success"
              data-toggle="tooltip"
              data-placement="top"
              title="Show Only from current"
              @click="showOnly">
              <i
                class="fa fa-search-plus"
                aria-hidden="true"/>
            </button>

            <button
              :disabled="!currentNode"
              type="button"
              class="btn btn-warning"
              data-toggle="tooltip"
              data-placement="top"
              title="Show current"
              @click="show">
              <i
                class="fa fa-binoculars"
                aria-hidden="true"/>
            </button>

            <button
              v-if="zoomable"
              type="button"
              class="btn btn-warning"
              data-toggle="tooltip"
              data-placement="top"
              title="Reset Zoom"
              @click="resetZoom">
              <i
                class="fa fa-arrows-alt"
                aria-hidden="true"/>
            </button>

          </div>
        </div>
      </div>


      <div class="panel panel-default">
        <div class="panel-heading">Events</div>

        <div class="panel-body log">
          <div
            v-for="(event,index) in events"
            :key="index">
            <p><b>Name:</b> {{ event.eventName }} <b>Data:</b>{{ event.data.text }}</p>
          </div>
        </div>
      </div-->

    </div>
    <div class="flex flex-column p3 sm-col-12 lg-col-9">
      <tree
        ref="tree"
        :identifier="getId"
        :zoomable="treeData.zoomable"
        :data="treeData.data.Graph.tree"
        :node-text="treeData.nodeText"
        :margin-x="treeData.Marginx"
        :margin-y="treeData.Marginy"
        :radius="treeData.radius"
        :type="treeData.type"
        :layout-type="treeData.layoutType"
        :duration="treeData.duration"
        class="tree"
        @clicked="onClick"
        @expand="onExpand"
        @retract="onRetract"/>
    </div>

  </div>
</template>

<script>
import { tree } from 'vued3tree';
import Sidebar from '@/components/Sidebar';
import Proxy from '@/proxies/Proxy';
import treeData from './data1.json';

Object.assign(treeData, {
  type: 'tree',
  layoutType: 'euclidean',
  duration: 750,
  Marginx: 30,
  Marginy: 30,
  radius: 5,
  nodeText: 'text',
  currentNode: null,
  zoomable: true,
  isLoading: false,
  events: [],
  data: {
    Graph: {
      tree: {
        children: [
          { children: [], id: 1, text: 'Home1' },
          { children: [], id: 2, text: 'Home2' },
          { children: [], id: 3, text: 'Home3' },
        ],
        id: 0,
        text: 'Home',
      },
      links: [],
      text: 'TREEDATA',
    },
  },
});

export default {
  components: {
    tree,
    Sidebar,
  },
  data() {
    return {
      message: {
        sent: '',
        received: '',
      },
      treeData,
      events: [],
    };
  },
  sockets: {
    ping_server(response) {
      this.message.received = response;
    },
  },
  methods: {
    pingServer() {
      this.$socket.emit('ping_server', this.message.sent);
    },
    do(action) {
      if (this.currentNode) {
        this.isLoading = true;
        this.$refs.tree[action](this.currentNode).then(() => {
          this.isLoading = false;
        });
      }
    },
    getId(node) {
      return node.id;
    },
    expandAll() {
      this.do('expandAll');
    },
    collapseAll() {
      this.do('collapseAll');
    },
    showOnly() {
      this.do('showOnly');
    },
    show() {
      this.do('show');
    },
    onClick(evt) {
      this.currentNode = evt.element;
      console.log(this.currentNode);
      this.onEvent('onClick', evt);
    },
    onExpand(evt) {
      this.onEvent('onExpand', evt);
    },
    onRetract(evt) {
      this.onEvent('onRetract', evt);
    },
    onEvent(eventName, data) {
      this.events.push({ eventName, data: data.data });
      console.log({ eventName, data });
    },
    resetZoom() {
      this.isLoading = true;
      this.$refs.tree.resetZoom().then(() => {
        this.isLoading = false;
      });
    },
    async getTopics() {
      try {
        const response = await new Proxy('topics').all();
        // this.treeData.data.Graph.tree
        console.log(response);
      } catch (e) {
        throw e;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
.tree {
  height: 600px;
  //width: 100%;
}
.graph-root {
  height: 800px;
  width: 100%;
}
.log {
  height: 500px;
  overflow-x: auto;
  overflow-y: auto;
  overflow: auto;
  text-align: left;
}
</style>
