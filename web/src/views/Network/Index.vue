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
    </div>
    <div class="flex flex-column p3 sm-col-12 lg-col-9">
      <tree
        ref="tree"
        :identifier="getId"
        :data="treeData.data.Graph.tree"
        :node-text="treeData.nodeText"
        :radius="treeData.radius"
        :type="treeData.type"
        :layout-type="treeData.layoutType"
        :duration="treeData.duration"
        margin-x="0"
        margin-y="0"
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

const d3 = require('d3');

Object.assign(treeData, {
  type: 'tree',
  layoutType: 'euclidean',
  duration: 750,
  radius: 5,
  nodeText: 'text',
  currentNode: null,
  marginX: 0,
  marginY: 0,
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
  mounted() {
    const path = d3.select('path.linktree');
    let startPoint = this.pathStartPoint(path);
    startPoint = ['36', '300'];
    const marker = d3.select('svg').append('circle');
    marker.attr('transform', `translate(${startPoint})`).attr('r', 5);
    this.transition(marker, path);
  },
  sockets: {
    ping_server(response) {
      this.message.received = response;
    },
  },
  methods: {
    pathStartPoint(path) {
      const d = path.attr('d')
        .split(' ');
      return d[1].split(',');
    },
    transition(marker, path) {
      setTimeout(() => {
        marker
          .transition()
          .duration(7500)
          .attrTween('transform', this.translateAlong(path.node()))
          .each('end', function() {}); // infinite loop
      }, 1000);
    },
    translateAlong(path) {
      const l = path.getTotalLength();
      return function () {
        return function (t) {
          const p = path.getPointAtLength(Math.abs(1 - t) * l);
          return `translate(${p.x + 36},${p.y})`; // Move marker
        };
      };
    },
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

path {
  fill: none;
  stroke: #000;
  stroke-width: 1px;
}

circle {
  fill: red;
}
</style>
