<template>
  <div class="container-fluid container">
    <div class="">
      <div
        id="side-bar"
        class="sm-col sm-col-12 lg-col-2">
        <Sidebar />
      </div>
    </div>

    <div class="flex flex-column p3">
      <div class="col md-col-12">
        <div class="col md-col-6">
          <h2>Network</h2>
          <svg
            width="500"
            height="350" />
        </div>

        <div class="col md-col-6">
          <h2>Publish</h2>
          <publish-form />
        </div>
      </div>
    </div>
    <message-modal modal-action="CREATE"/>
  </div>
</template>

<script>
/* eslint-disable */
import Proxy from '@/proxies/Proxy';
import Sidebar from '@/components/Sidebar';
import MessageModal from '@/components/MessageModal';
import PublishForm from './PublishForm';
import * as d3 from 'd3';

export default {
  components: {
    Sidebar,
    MessageModal,
    PublishForm,
  },
  data() {
    return {
      message: {
        sent: '',
        received: '',
      },
      showMessageModal: false,
      devices: [],
      events: [],
      graph: null,
      svgD3: null,
      simulationD3: null,
      widthSVG: 500,
      heightSVG: 350,
      radiusLink: 150,
      durationTransiction: 500
    };
  },
  async mounted() {
    try {
      const response = await new Proxy('api/devices').all();
      this.devices = response.data;
      this.setTree();
      this.presentTree();
    } catch (e) {
      console.log(e);
      this.$message({
        message: 'Error retrieving devices!',
        type: 'error',
      });
    }
  },
  async created() {
    // other calls
  },
  sockets: {
    message(data) {
      const deviceName = data.properties.appId;
      const msg = new TextDecoder('utf-8').decode(data.content);

      for (let i = 0; i < this.devices.length; i += 1) {
        const device = this.devices[i];
        if (device.name !== deviceName) {
          continue;
        }

        const indexLinkFromPublisher = 2 * i;
        this.transition(indexLinkFromPublisher, msg);
      }
    },
    receiver_message(data) {
      const msg = new TextDecoder('utf-8').decode(data.content);
      const consumerName = data.fields.consumerTag.replace(/_/g, ' ');
      let indexLinkToConsumer = null;

      for (let i = 0; i < this.devices.length; i += 1) {
        const device = this.devices[i];
        if (device.name !== consumerName) {
          continue;
        }

        indexLinkToConsumer = 2 * i + 1;
        break;
      }
      console.log(indexLinkToConsumer);
      const transition = this.transition;
      setTimeout(function() {
        transition(indexLinkToConsumer, msg);
      }, this.durationTransiction);
    },
  },
  methods: {
    closeModal() {
      this.showMessageModal = false;
    },
    presentTree() {
      this.svg = d3.select('svg');
      const width = this.svg.attr('width');
      const height = this.svg.attr('height');

      const color = d3.scaleOrdinal(d3.schemeCategory20);

      this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink().distance(10).strength(0.5))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

      const nodes = this.graph.nodes,
        nodeById = d3.map(nodes, function(d) { return d.id; }),
        links = this.graph.links,
        bilinks = [];

      links.forEach(function(link) {
        const s = link.source = nodeById.get(link.source),
          t = link.target = nodeById.get(link.target),
          i = {}; // intermediate node
        nodes.push(i);
        links.push({ source: s, target: i }, { source: i, target: t });
        bilinks.push([s, t]);
      });

      const link = this.svg.selectAll('.link')
        .data(bilinks)
        .enter().append('path')
        .attr('class', 'link');

      const node = this.svg.selectAll('.node')
        .data(nodes.filter(function(d) {
            return d.id;
        }))
        .enter().append('g');
      const circles = node.append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('fill', function(d) {
            return color(d.group);
        });
      const lables = node.append('text')
        .text(function(d) {
          return d.name;
        })
        .attr('fill', 'red')
        .attr('class', 'text')
        .attr('x', 7)
        .attr('y', -7);

      node.append('title')
        .text(function(d) { return d.name; });

      const positionLink_ = this.positionLink;
      const positionNode_ = this.positionNode;
      this.simulation
        .nodes(nodes)
        .on('tick', function ticked() {
            link.attr('d', positionLink_);
            node.attr('transform', positionNode_);
        });

      this.simulation.force('link')
        .links(links);
    },
    setTree() {
      const centerX = this.widthSVG / 2,
        centerY = this.heightSVG / 2,
        radius = this.radiusLink,
        teta = 2*Math.PI/this.devices.length,
        graph = {
          'nodes': [],
          'links': []
        };

      for (let i = 0; i < this.devices.length; i += 1) {
        const device = this.devices[i];
        const node = {
          'id': (i+1).toString(),
          name: device.name,
          'fx': radius * Math.cos(teta*i) + centerX,
          'fy': radius * Math.sin(teta*i) + centerY,
          'group': 1
        };
        graph['nodes'].push(node);
      }
      const exchangeNode = {
        'id': (this.devices.length+1).toString(),
        name: 'Exchange',
        'fx': centerX,
        'fy': centerY,
        'group': 2
      };
      graph['nodes'].push(exchangeNode);

      for (let i = 0; i < this.devices.length; i += 1) {
        const linkTo = {
          'source': (i+1).toString(),
          'target': (this.devices.length+1).toString(),
          'value': 1
        }
        const linkFrom = {
          'source': linkTo['target'],
          'target': linkTo['source'],
          'value': 1
        }
        graph['links'].push(linkTo);
        graph['links'].push(linkFrom);
      }

      this.graph = graph;
    },
    positionLink(d) {
      return 'M' + d[0].x + ',' + d[0].y +
          'S' + d[1].x + ',' + d[1].y +
          ' ' + d[1].x + ',' + d[1].y;
    },
    positionNode(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    },
    dragstarted(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0.1).restart();
        d.fx = d.x, d.fy = d.y;
    },
    dragged(d) {
        d.fx = d3.event.x, d.fy = d3.event.y;
    },
    dragended(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null, d.fy = null;
    },
    transition(node_index, msg) {
      if (node_index === null) {
        return;
      }
      const transition_ = this.transition;
      const node_count = this.svg.selectAll('path').nodes().length;

      const walkingCircle = this.svg.append('g').attr('class', 'walking circle text');
      walkingCircle.append('circle')
        .attr('class', 'walking circle')
        .attr('r', 5);
      walkingCircle.append('text')
        .text(msg)
        .attr('fill', 'red')
        .attr('class', 'text')
        .attr('x', 6)
        .attr('y', -3);

      walkingCircle.transition()
          .duration(this.durationTransiction)
          .attr('opacity', 1)
          .attrTween('transform', this.translateAlong(this.svg.selectAll('path').nodes()[node_index]))
          .on('end', function() {
              walkingCircle.remove();
          });
    },
    translateAlong(path) {
      const l = path.getTotalLength();
      return function(d, i, a) {
        return function(t) {
          const p = path.getPointAtLength(t * l);
          return 'translate(' + p.x + ',' + p.y + ')';
        };
      };
    }
  },
};
</script>

<style lang="scss">
.node {
  stroke: #6DA1FF;
  stroke-width: 1.5px;
  fill: #2f4f4f;
  opacity: 1;
}
.link {
  stroke: #999;
  stroke-width: 4px;
  stroke-opacity: 0.6;
}
.walking.circle {
  fill: #6DA1FF;
}
.text {
  font-family: sans-serif;
  font-size: 11px;
  fill: black; /* <== Set the fill */
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  cursor: move;
}
</style>
