import Vue from 'vue';
import { IColumn, IOrderedColumn, IColumnState } from '../types';

export default Vue.extend({
  props: {
    columns: {
      type: Array as () => IColumn[],
      required: true,
    },

    columnsState: {
      type: Array as () => IColumnState[],
      default: undefined,
    },
  },

  data() {
    return {
      internalColumnsState: [] as IColumnState[],
    };
  },

  computed: {
    orderedColumns(): IOrderedColumn[] {
      return this.internalColumnsState.map(oc => ({
        column: this.findColumn(oc.key),
        visible: oc.visible,
      }));
    },

    visibleColumns(): IColumn[] {
      return this.internalColumnsState
        .filter(oc => oc.visible)
        .map(oc => this.findColumn(oc.key));
    },
  },

  watch: {
    // TODO We probably need to handle this better, if we actually need to handle it
    columns: {
      handler() {
        this.initColumnsState();
      },
      immediate: true,
    },

    columnsState(val) {
      this.internalColumnsState = this.validateSavedColumns(val);
    },

    internalColumnsState(val) {
      if (val !== this.columnsState) {
        this.$emit('update:columns-state', val);
      }
    },
  },

  methods: {
    async initColumnsState() {
      if (this.columnsState && this.columnsState.length) {
        this.internalColumnsState = this.columnsState;
      } else if (this.internalColumnsState.length === 0) {
        await Vue.nextTick();
        this.internalColumnsState = this.columns.map(column => (
          { key: column.key, visible: !column.hidden }
        ));
      }
    },

    moveColumn({ from, to }: { from: number, to: number}) {
      const fromKey = this.visibleColumns[from].key;
      const fromIndex = this.orderedColumns.findIndex(oc => oc.column.key === fromKey);

      let toIndex: number;
      if (to === 0) {
        toIndex = 0;
      } else {
        const afterKey = this.visibleColumns[to - 1].key;
        toIndex = this.orderedColumns.findIndex(oc => oc.column.key === afterKey) + 1;
      }

      const newState = this.internalColumnsState.slice(0);
      const moved = newState.splice(fromIndex, 1);
      newState.splice(toIndex, 0, ...moved);

      this.internalColumnsState = newState;
    },

    toggleColumn({ index, checked }: { index: number, checked: boolean }) {
      // XXX Something like immutable.js would be helpful here
      this.internalColumnsState = this.internalColumnsState.map((col, i) => (
        i === index ? { ...col, visible: !col.visible } : col
      ));
    },

    findColumn(key: string): IColumn {
      const it = this.columns.find(column => column.key === key);
      if (!it) throw new Error(`Column not found: ${key}`);
      return it;
    },

    validateSavedColumns(columnsState: IColumnState[]): IColumnState[] {
      const missingColumns = this.columns
        .filter(c => !columnsState.find(o => o.key === c.key))
        .map(c => {
          console.warn(`Column ${c.key} was not included in saved state, and will be moved last and hidden.`);
          return { key: c.key, visible: false };
        });

      const extraColumnsRemoved = columnsState
        .filter(o => {
          if (this.columns.find(c => c.key === o.key)) {
            return true;
          } else {
            console.warn(`Column ${o.key} in saved state does not exist.`);
            return false;
          }
        });

      if (missingColumns.length || extraColumnsRemoved.length !== columnsState.length) {
        return extraColumnsRemoved.concat(missingColumns);
      }

      // Everything OK. We must return the original array, to avoid infinite loop
      return columnsState;
    },
  },
});
