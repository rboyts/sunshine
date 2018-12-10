<template>
  <div>
    <svg :width="size" :height="size">
      <g :transform="`translate(${size / 2}, ${size / 2})`">
        <path v-for="(d, i) in arcs" :key="i" :fill="scheme[i % scheme.length]" :d="d" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as d3 from 'd3';

interface IData {
  label: string;
  value: number;
}

export default Vue.extend({
  name: 'data-chart',

  props: {
    data: Array as () => IData[],
    scheme: {
      type: Array as () => string[],
      default: () => d3.schemeDark2,
    },
    size: {
      type: Number,
      default: 400,
    },
  },

  computed: {
    pieGenerator(): d3.Pie<any, number | {valueOf(): number}> {
      return d3
        .pie()
        .startAngle(0)
        .endAngle(Math.PI * 2);
    },

    arcGenerator(): d3.Arc<any, d3.DefaultArcObject> {
      return d3
        .arc()
        .innerRadius(0)
        .outerRadius(this.size / 2);
    },

    values(): number[] {
      return this.data.map((d: IData) => d.value);
    },

    pie(): any[] {
      return this.pieGenerator(this.values);
    },

    arcs(): any[] {
      return this.pie.map((args: any) => this.arcGenerator(args));
    },
  },
});
</script>
