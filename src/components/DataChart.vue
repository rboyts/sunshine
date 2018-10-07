<script lang="ts">
import Vue, { VNode } from 'vue';
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
    pieGenerator() {
      return d3
        .pie()
        .startAngle(0)
        .endAngle(Math.PI * 2);
    },

    arcGenerator(): any {
      return d3
        .arc()
        .innerRadius(0)
        .outerRadius(this.size / 2);
    },

    values(): any[] {
      return this.data.map(d => d.value);
    },

    pie(): any[] {
      return this.pieGenerator(this.values);
    },

    arcs(): any[] {
      return this.pie.map((args: any) => this.arcGenerator(args));
    },
  },

  methods: {
    renderArcs(): VNode[] {
      const h = this.$createElement;
      const scheme = this.scheme;
      return this.arcs.map((d, i) => h('path', {attrs: {fill: scheme[i % scheme.length], d}}));
    },

    renderChart(): VNode {
      const h = this.$createElement;
      return h('svg', {
        attrs: {
          width: this.size,
          height: this.size,
        },
      }, [
        h('g', {
          attrs: {
            transform: `translate(${this.size / 2}, ${this.size / 2})`,
          },
        }, this.renderArcs()),
      ]);
    },
  },

  render(): VNode {
    const h = this.$createElement;

    return h('div', [this.renderChart()]);
  },
});
</script>
