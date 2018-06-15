<template>
  <div class="container-fluid container">
    <div class="">
      <div
        id="side-bar"
        class="sm-col sm-col-12 lg-col-2">
        <Sidebar />
      </div>
    </div>
    <svg
      width="960"
      height="600" />
    <message-modal modal-action="CREATE"/>
  </div>
</template>

<script>
/* eslint-disable */
import Sidebar from '@/components/Sidebar';
import MessageModal from '@/components/MessageModal';
import * as d3 from 'd3';

export default {
  components: {
    Sidebar,
    MessageModal,
  },
  data() {
    return {
      events: [],
    };
  },
  mounted() {
    console.log('hello');
    console.log(Math.PI);
    console.log(Math.sin(Math.PI));
    const svg = d3.select('svg');
    const width = 960; // +svg.attr("width");
    const height = 600; // +svg.attr("height");

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .distance(10)
          .strength(0.5),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    let radius = 100,
      centerX = 450,
      centerY = 300;
    const graph = {
      nodes: [
        { id: '1', name: 'no1', fx: centerX, fy: centerY, group: 1 },
        {
          id: '2',
          name: 'no2',
          fx: radius * Math.cos(0) + centerX,
          fy: radius * Math.sin(0) + centerY,
          group: 1,
        },
        {
          id: '3',
          name: 'no3',
          fx: radius * Math.cos(2 * Math.PI / 3) + centerX,
          fy: radius * Math.sin(2 * Math.PI / 3) + centerY,
          group: 2,
        },
        {
          id: '4',
          name: 'no4',
          fx: radius * Math.cos(2 * 2 * Math.PI / 3) + centerX,
          fy: radius * Math.sin(2 * 2 * Math.PI / 3) + centerY,
          group: 2,
        },
      ],
      links: [
        { source: '1', target: '2', value: 1 },
        { source: '1', target: '3', value: 1 },
        { source: '1', target: '4', value: 1 },
      ],
    };

    let nodes = graph.nodes,
      nodeById = d3.map(nodes, d => d.id),
      links = graph.links,
      bilinks = [];

    links.forEach((link) => {
      let s = (link.source = nodeById.get(link.source)),
        t = (link.target = nodeById.get(link.target)),
        i = {}; // intermediate node
      nodes.push(i);
      links.push(
        {
          source: s,
          target: i,
        },
        {
          source: i,
          target: t,
        },
      );
      bilinks.push([s, t]);
    });

    console.log(bilinks);

    const link = svg
      .selectAll('.link')
      .data(bilinks)
      .enter()
      .append('path')
      .attr('class', 'link');

    svg
      .append('circle')
      .attr('class', 'walking circle')
      .attr('r', 5);

    const node = svg
      .selectAll('.node')
      .data(
        nodes.filter(d => d.id),
      )
      .enter()
      .append('g');
    const circles = node
      .append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .attr('fill', d => color(d.group));

    const lables = node
      .append('text')
      .text(d => d.name)
      .attr('fill', 'red')
      .attr('class', 'text')
      .attr('x', 6)
      .attr('y', 3);

    node.append('title').text(d => d.name);

    simulation.nodes(nodes).on('tick', ticked);

    simulation.force('link').links(links);

    transition(0);
    //  transition(1);
    function ticked() {
      link.attr('d', positionLink);
      node.attr('transform', positionNode);
    }

    // ///////////////////////////////////////////////////////////////////////

    function positionLink(d) {
      return (
        `M${
          d[0].x
        },${
          d[0].y
        }S${
          d[1].x
        },${
          d[1].y
        } ${
          d[1].x
        },${
          d[1].y}`
      );
    }

    function positionNode(d) {
      return `translate(${d.x},${d.y})`;
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.1).restart();
      (d.fx = d.x), (d.fy = d.y);
    }
    function dragged(d) {
      (d.fx = d3.event.x), (d.fy = d3.event.y);
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      (d.fx = null), (d.fy = null);
    }

    function transition(node_index = 0) {
      // console.log(svg.selectAll('path').nodes());
      const node_count = svg.selectAll('path').nodes().length;
      if (node_index == node_count) {
        node_index = 0;
      }
      svg
        .selectAll('.walking.circle')
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attrTween(
          'transform',
          translateAlong(svg.selectAll('path').nodes()[node_index]),
        )
        .on('end', () => {
          transition(node_index + 1);
        });
    }

    // Returns an attrTween for translating along the specified path element.
    function translateAlong(path) {
      // console.log(path);
      const l = path.getTotalLength();
      return function (d, i, a) {
        return function (t) {
          const p = path.getPointAtLength(t * l);
          return `translate(${p.x},${p.y})`;
        };
      };
    }
    console.log('sdfsdf');
  },
  methods: {},
};
</script>

<style lang="scss">
.node {
  stroke: #a9a9a9;
  stroke-width: 1.5px;
  fill: #2f4f4f;
  opacity: 0.6;
}
.link {
  stroke: #999;
  stroke-width: 2px;
  stroke-opacity: 0.6;
}
.walking.circle {
  fill: #ffa500;
}
.text {
  font-family: sans-serif;
  font-size: 11px;
  fill: black; /* <== Set the fill */
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  cursor: move;
}
</style>
