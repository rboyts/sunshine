<template>
  <div class="data-table">
    <table
        @drag.prevent="onDrag($event)"
        @dragenter.prevent="onDragOver($event)"
        @dragover.prevent="onDragOver($event)"
        @drop.prevent="onDrop($event)"
        @dragend.prevent="onDragEnd($event)"
      >
      <thead>
        <tr>
          <th v-for="(column, index) in _columns"
            :key="column.key"
            :class="column.cls"
            :style="column.style"
          >
            <span class="handle" draggable @dragstart="onDragStart($event, index)">&#8943;</span>{{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in items"
          :key="user.id"
        >
          <td v-for="column in _columns" :key="column.key"
            :class="column.cls"
            :style="column.style"
          >
            {{ user[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface IDragState {
  column: number;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  widths: number[];
}

interface IColumn {
  key: string;
  label: string;
}

interface IItem {
  [key: string]: any;
}

export default Vue.extend({
  name: 'data-table',

  props: {
    columns: Array as () => IColumn[],
    items: Array as () => IItem[],
  },

  data() {
    return {
      drag: null as IDragState | null,
      // internalColumns: this.columns,
    };
  },

  computed: {
    _columns(): any[] {
      return this.columns.map((c, i) => ({
        ...c,
        style: this.getColumnStyle(i),
        cls: this.getColumnClass(i),
      }));
    },

    thresholds(): number[] {
      if (!this.drag) return [];

      let { column, widths } = this.drag;

      let res: number[] = [];
      let sum = 0;

      widths.forEach((w, i) => {
        if (i !== column) {
          res.push(sum + w / 2);
          sum += w;
        }
      });

      // Add sentinel value to simplify logic
      res.push(Number.MAX_VALUE);

      return res;
    },

    currentDropIndex(): number {
      if (!this.drag) return 0;

      let { curX, startX, widths, column } = this.drag;

      let offsetX = curX - startX;
      let originalX = widths.slice(0, column).reduce((s, w) => s + w, 0);
      let pos = originalX + offsetX;
      return this.thresholds.findIndex(t => t > pos);
    },
  },

  methods: {
    getTransform(index: number): string | null {
      if (!this.drag) return null;

      let { curX, curY, startX, startY, widths, column } = this.drag;

      let offsetX = curX - startX;

      let dc = column;

      if (index === dc) {
        return `translateX(${offsetX}px)`;
      }

      let shift = widths[dc];

      if (index < dc && index >= this.currentDropIndex) {
        return `translateX(${shift}px)`;
      }
      if (index > dc && index <= this.currentDropIndex) {
        return `translateX(${-shift}px)`;
      }

      return null;
    },

    getTotalColumnWidth(widths: number[], start: number, end: number): number {
      if (start > end) {
        [start, end] = [end, start];
      }
      return widths.slice(start + 1, end).reduce((s, v) => s + v, 0);
    },

    getColumnStyle(index: number) {
      return {
        transform: this.getTransform(index),
      };
    },

    getColumnClass(index: number): string | null {
      if (!this.drag) return null;

      return index === this.drag.column ? 'dragging' : 'animating';
    },

    onDrop(event: DragEvent) {
      if (!this.drag) return;

      let from = this.drag.column;
      let to = this.currentDropIndex;

      if (from !== to) {
        // let columns = this.columns.slice(0);
        const moved = this.columns.splice(from, 1);
        this.columns.splice(to, 0, ...moved);
        // this.columns = columns;
      }
    },

    onDragEnd(event: DragEvent) {
      setTimeout(() => { this.drag = null; }, 5000);
    },

    onDragStart(event: DragEvent, index: number) {
      let element = event.target as HTMLElement;
      if (element === null) return;

      let row = element.closest('tr');
      if (row === null) return;

      let widths: number[] = [];
      for (let c of row.children) {
        widths.push((c as HTMLElement).offsetWidth);
      }

      this.drag = {
        column: index,
        startX: event.screenX,
        startY: event.screenY,
        curX: event.screenX,
        curY: event.screenY,
        widths,
      };

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(new Image(), 0, 0);
      }
    },

    onDragOver(event: DragEvent) {
      //
    },

    onDrag(event: DragEvent) {
      if (!this.drag) return;

      this.drag.curX = event.screenX;
      this.drag.curY = event.screenY;
    },
  },
});
</script>

<style scoped lang="scss">

$outer-border : 1px solid #bbb;
$inner-border : 1px solid #ccc;

.data-table {
  border: $outer-border;
  background-color: #ddd;

  overflow: auto;
  height: 100%;
}

.data-table > table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  td {
    background-color: #fff;

    &.dragging {
      background-color: rgba(#fff, .8);
    }
  }

  th {
    background-color: #f1f1f1;

    &.dragging {
      background-color: rgba(#f1f1f1, .8);
      position: relative;
      z-index: 200;
    }
  }

  th, td {
    text-align: left;
    white-space: nowrap;
    padding: 16px;

    &:not(:last-child) {
      border-right: $inner-border;
    }

    &.dragging {
      border-left: $inner-border;
      border-right: $inner-border;
      position: relative;
      z-index: 200;
    }

    &.animating {
      transition: transform .3s;
    }
  }

  tr:not(:last-child) {
    th, td {
      border-bottom: $inner-border;
    }
  }

  .data-header {
    display: flex;
    flex-direction: row;
  }

  .handle {
    cursor: move;
    margin-right: 8px;
  }
}
</style>
