<template>
  <div class="container-fluid container">
    <div class="">
      <div
        id="side-bar"
        class="sm-col sm-col-12 lg-col-2">
        <Sidebar />
      </div>
      <div>
        <el-button
          type="primary"
          @click="showMessageModal = true">Create Message</el-button>
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
        :margin-x="treeData.marginX"
        :margin-y="treeData.marginY"
        class="tree"
        @clicked="onClick"
        @expand="onExpand"
        @retract="onRetract"/>
    </div>
    <el-dialog
      :visible.sync="showMessageModal"
      title="Create Message"
      width="50%">
      <message-modal :topics="topics" @closeModal="closeModal"/>
    </el-dialog>
  </div>
</template>

<script>
import tree from '@/components/WayBetterTree/Tree';
import Sidebar from '@/components/Sidebar';
import MessageModal from './MessageModal';
import Proxy from '@/proxies/Proxy';
import treeData from './data1.json';

const d3 = require('d3');

Object.assign(treeData, {
  type: 'tree',
  layoutType: 'euclidean',
  duration: 750,
  radius: 5,
  marginX: 0,
  marginY: 0,
  nodeText: 'text',
  currentNode: null,
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
    MessageModal,
  },
  data() {
    return {
      message: {
        sent: '',
        received: '',
      },
      showMessageModal: false,
      topics: [],
      treeData,
      events: [],
    };
  },
  async created() {
    try {
      const response = await new Proxy('topics').all();
      console.log(response);
      this.topics = response;
    } catch (e) {
      this.$message({
        message: 'Error retrieving topics!',
        type: 'error',
      });
    }

    // Example -> this.animateMessage('Home', 'Home1');
  },
  sockets: {
    ping_server(response) {
      this.message.received = response;
    },
  },
  methods: {
    closeModal() {
      this.showMessageModal = false;
    },
    animateMessage(senderName, receiverName) {
      let senderNode = null;
      let receiverNode = null;
      d3.selectAll('.nodetree').each((d) => {
        if (d.data.text === senderName) {
          senderNode = d;
        } else if (d.data.text === receiverName) {
          receiverNode = d;
        }
      });
      if (senderNode == null && receiverNode == null) {
        throw new Error('Invalid node name');
      }

      const senderCoords = { x: senderNode.x, y: senderNode.y };
      const receiverCoords = { x: receiverNode.x, y: receiverNode.y };
      let inverseDirection = false;
      let animationPath = null;
      d3.selectAll('path.linktree').each(function () {
        const path = d3.select(this);
        path.attr('d', (d) => {
          if (d.x === receiverCoords.x && d.y === receiverCoords.y) {
            animationPath = path;
          } else if (d.x === senderCoords.x && d.y === senderCoords.y) {
            animationPath = path;
            inverseDirection = true;
          }
        });
      });
      if (animationPath != null) {
        this.startAnimation(
          animationPath,
          [senderCoords.x, senderCoords.y],
          inverseDirection,
        );
      }
    },
    startAnimation(path, startPoint, inverseDirection) {
      const marker = d3.select('svg').append('circle');
      marker.attr('transform', `translate(${startPoint})`).attr('r', 5);
      this.transition(marker, path, inverseDirection);
    },
    transition(marker, path, inverseDirection) {
      marker
        .transition()
        .duration(7500)
        .attrTween(
          'transform',
          this.translateAlong(path.node(), inverseDirection),
        )
        .remove();
    },
    translateAlong(path, inverseDirection) {
      const l = path.getTotalLength();
      return () => (t) => {
        const aux = inverseDirection ? t : 1 - t;
        const p = path.getPointAtLength(Math.abs(aux) * l);
        return `translate(${p.x + 36},${p.y})`; // 36 is the parent transformation
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
