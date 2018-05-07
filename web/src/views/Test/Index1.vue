
<template>
    <svg width="500" height="300">
    </svg>
</template>


<script>
const d3 = require('d3');
export default {
  mounted(){
    this.drawCircle(50,50,10, "1");
    this.drawCircle(50,50,10, "2");
    this.drawLine(50,50,300,50, "3");
    this.drawCircle(300,50,10, "4");
    this.animation();
  },
  methods:{
      drawCircle(x, y, radius, id){
        d3.select(this.$el)
        .append('circle')
        .attr('id', id)
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius);
      },
      drawLine(x1,y1,x2,y2, id){
          d3.select(this.$el)
          .append('line')
          .attr("id", id)
          .attr("x1",x1)
          .attr("y1",y1)
          .attr("x2",x2)
          .attr("y2",y2)
          .attr("stroke-width",2)
          .attr("stroke", "black");
      },
      animation(){
        d3.select("#1").transition()
            .duration(750)
            .delay(function(d, i) { return i * 10; })
            .attr("r", function(d) { return Math.sqrt(d * scale); });
        }
  }
}
</script>
