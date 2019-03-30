import Vue from 'vue';
import { IColumn, IOrderedColumn, IColumnState } from '../types';

export default Vue.extend({
  props: {
    columns: Array as () => IColumn[],
    columnsState: Array as () => IColumnState[],
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
      this.internalColumnsState = val;
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

      const moved = this.internalColumnsState.splice(fromIndex, 1);
      this.internalColumnsState.splice(toIndex, 0, ...moved);
    },

    toggleColumn({ index, checked }: { index: number, checked: boolean }) {
      this.internalColumnsState[index].visible = checked;
    },

    findColumn(key: string): IColumn {
      const it = this.columns.find(column => column.key === key);
      if (!it) throw new Error(`Column not found: ${key}`);
      return it;
    },

    validateSavedColumns(columns: IColumnState[]): IColumnState[] {
      const missingColumns = this.columns
        .filter(c => !columns.find(o => o.key === c.key))
        .map(c => {
          console.warn(`Column ${c.key} was not included in saved state, and will be moved last and hidden.`);
          return { key: c.key, visible: false };
        });

      return columns
        .concat(missingColumns)
        .filter(o => {
          if (this.columns.find(c => c.key === o.key)) {
            return true;
          } else {
            console.warn(`Column ${o.key} in saved state does not exist.`);
            return false;
          }
        });
    },
  },
});
