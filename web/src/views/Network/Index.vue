<template>
  <div class="container-fluid container">
    <div class="">
      <div
        id="side-bar"
        class="sm-col sm-col-12 lg-col-2">
        <Sidebar />
      </div>
    </div>
    <svg width="960" height="600"/></svg>
    <el-dialog
      :visible.sync="showMessageModal"
      title="Create Message"
      width="50%">
      <message-modal
        :topics="topics"
        @closeModal="closeModal"/>
    </el-dialog>
  </div>
</template>

<script>
import tree from '@/components/WayBetterTree/Tree';
import Sidebar from '@/components/Sidebar';
import Proxy from '@/proxies/Proxy';
import MessageModal from './MessageModal';
import * as d3 from 'd3';

const treeData = {};
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
  mounted() {
    console.log('hello');
    console.log(Math.PI);
    console.log(Math.sin(Math.PI));
    var svg = d3.select("svg");
    var width = 960; //+svg.attr("width");
    var height = 600; //+svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(10).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var radius = 100,
        centerX = 450,
        centerY = 300;
    var graph = {
      "nodes": [
        {"id": "1", name: "no1", "fx": centerX, "fy": centerY, "group": 1},
        {"id": "2", name: "no2", "fx": radius * Math.cos(0) + centerX, "fy": radius * Math.sin(0) + centerY, "group": 1},
        {"id": "3", name: "no3", "fx": radius * Math.cos(2*Math.PI/3) + centerX, "fy": radius * Math.sin(2*Math.PI/3) + centerY, "group": 2},
        {"id": "4", name: "no4", "fx": radius * Math.cos(2*2*Math.PI/3) + centerX, "fy": radius * Math.sin(2*2*Math.PI/3) + centerY, "group": 2}
      ],
      "links": [
        {"source": "1", "target": "2", "value": 1},
        {"source": "1", "target": "3", "value": 1},
        {"source": "1", "target": "4", "value": 1},
      ]
    };

    var nodes = graph.nodes,
        nodeById = d3.map(nodes, function(d) {
            return d.id;
        }),
        links = graph.links,
        bilinks = [];

    links.forEach(function(link) {
        var s = link.source = nodeById.get(link.source),
            t = link.target = nodeById.get(link.target),
            i = {}; // intermediate node
        nodes.push(i);
        links.push({
            source: s,
            target: i
        }, {
            source: i,
            target: t
        });
        bilinks.push([s, t]);
    });

    console.log(bilinks);

    var link = svg.selectAll(".link")
        .data(bilinks)
        .enter().append("path")
        .attr("class", "link");

    svg.append("circle")
        .attr("class", "walking circle")
        .attr("r", 5);

    var node = svg.selectAll(".node")
        .data(nodes.filter(function(d) {
            return d.id;
        }))
        .enter().append('g');
    var circles = node.append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", function(d) {
            return color(d.group);
        });

    var lables = node.append("text")
        .text(function(d) {
          return d.name;
        })
        .attr("fill", 'red')
        .attr('class', 'text')
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
      .text(function(d) { return d.name; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    transition(0);
  //  transition(1);
    function ticked() {
        link.attr("d", positionLink);
        node.attr("transform", positionNode);
    }

    /////////////////////////////////////////////////////////////////////////

    function positionLink(d) {
        return "M" + d[0].x + "," + d[0].y +
            "S" + d[1].x + "," + d[1].y +
            " " + d[1].x + "," + d[1].y;
    }

    function positionNode(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x, d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x, d.fy = d3.event.y;
    }
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null, d.fy = null;
    }

    function transition(node_index = 0) {
      // console.log(svg.selectAll('path').nodes());
        var node_count = svg.selectAll('path').nodes().length
        if (node_index == node_count) {
            node_index = 0;
        }
        svg.selectAll('.walking.circle').transition()
            .duration(500)
            .attr("opacity", 1)
            .attrTween("transform", translateAlong(svg.selectAll('path').nodes()[node_index]))
            .on("end", function() {
                transition(node_index + 1);
            });
    }

    // Returns an attrTween for translating along the specified path element.
    function translateAlong(path) {
      //console.log(path);
        var l = path.getTotalLength();
        return function(d, i, a) {
            return function(t) {
                var p = path.getPointAtLength(t * l);
                return "translate(" + p.x + "," + p.y + ")";
            };
        };
    }
    console.log('sdfsdf');
  },
  async created() {
    try {
      //const response = await new Proxy('api/topics').all();
      //this.topics = response.data;

    } catch (e) {
      console.log(e);
      /*this.$message({
        message: 'Error retrieving topics!',
        type: 'error',
      });*/
    }

    // Example -> this.animateMessage('Home', 'Home1');
  },
  methods: {
    closeModal() {
      this.showMessageModal = false;
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.node {
  stroke: #A9A9A9;
  stroke-width: 1.5px;
  fill: #2F4F4F;
  opacity: 0.6;
}
.link {
  stroke: #999;
  stroke-width: 2px;
  stroke-opacity: 0.6;
}
.walking.circle {
  fill: #FFA500;
}
.text {
  font-family: sans-serif;
  font-size: 11px;
  fill: black;   /* <== Set the fill */
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  cursor: move;
}
</style>
