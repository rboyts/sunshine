<template>
  <span class="s-table__outline">
    <span
      v-for="(segment, i) in segments"
      :key="i"
      class="s-table__outline__section"
    >
      <svg
        :width="width"
        :height="rowHeight"
      >
        <line
          v-for="(line, j) in segment"
          :key="j"
          v-bind="line"
        />
      </svg>
    </span>

    <span class="s-table__icon">
      <s-icon
        v-if="node.item.icon"
        :name="node.item.icon"
      />
    </span>
  </span>
</template>

<script>
import Vue from 'vue';

const OUTLINE_WIDTH = 24; // Must correspond to CSS

export default Vue.extend({
  name: 'STableOutline',

  props: {
    node: {
      type: Object,
      required: true,
    },

    isOpen: {
      type: Boolean,
      required: true,
    },

    rowHeight: {
      type: Number,
      required: true,
    },
  },

  computed: {
    width() {
      return OUTLINE_WIDTH;
    },

    segments() {
      return this.getSegments();
    },
  },

  methods: {
    getSegments() {
      const segments = [];

      // Render nested children with correct indentation, and connect lines between
      // grandparents and remaining items, at any level. Unlimited number of levels are
      // supported, by traversing the parent hierarchy, and inserting sections
      // to the beginning of the array.
      let p = this.node.parent;
      while (p != null) {
        if (p.parent) {
          segments.unshift(!p.isLastChild ? this.getLineSegment() : []);
        }
        p = p.parent;
      }

      // Draw outline for this item, if it is a child item. This line will
      // connect to the line of the line above.
      if (this.node.parent != null) {
        segments.push(this.getAngleSegment(!this.node.isLastChild));
      }

      // Render start line that child items will connect to, if any.
      const hasTail = (this.isOpen && this.node.subItems && this.node.subItems.length);
      segments.push(hasTail ? this.getTailSegment() : []);

      return segments;
    },

    getLineSegment() {
      return [{
        x1: OUTLINE_WIDTH / 2,
        x2: OUTLINE_WIDTH / 2,
        y1: 0,
        y2: this.rowHeight,
      }];
    },

    getAngleSegment(continues) {
      const mid = this.rowHeight / 2 - 1;
      return [
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: 0,
          y2: continues ? this.rowHeight : mid,
        },
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH - 4,
          y1: mid,
          y2: mid,
        },
      ];
    },

    getTailSegment() {
      return [
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: this.rowHeight / 2 + 14,
          y2: this.rowHeight,
        },
      ];
    },
  },
});
</script>
