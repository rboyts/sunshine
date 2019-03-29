import Vue from 'vue';
import { IColumn, IOrderedColumn, IColumnState } from '../types';

export default Vue.extend({
  props: {
    columns: Array as () => IColumn[],
  },

  data() {
    return {
      columnsState: [] as IColumnState[],
    };
  },

  computed: {
    orderedColumns(): IOrderedColumn[] {
      return this.columnsState.map(oc => ({
        column: this.findColumn(oc.key),
        visible: oc.visible,
      }));
    },

    visibleColumns(): IColumn[] {
      return this.columnsState
        .filter(oc => oc.visible)
        .map(oc => this.findColumn(oc.key));
    },
  },

  watch: {
    // TODO We probably need to handle this better, if we actually need to handle it
    columns: {
      handler(val: IColumn[]) {
        this.columnsState = val.map(column => ({ key: column.key, visible: true }));
      },
      immediate: true,
    },
  },

  methods: {
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

      const moved = this.columnsState.splice(fromIndex, 1);
      this.columnsState.splice(toIndex, 0, ...moved);
    },

    toggleColumn({ index, checked }: { index: number, checked: boolean }) {
      this.columnsState[index].visible = checked;
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
