import { Module } from 'vuex';
import { IColumn, IDataTableState, FetchData, IFetchItemsPayload, ISortState } from './components/types';

export interface ICreateDataModuleOptions {
  columns: IColumn[];
  fetch: FetchData;
}

export const createDataModule = <RootState = any>(options: ICreateDataModuleOptions):
    Module<IDataTableState, RootState> => ({
  namespaced: true,

  state: {
    skip: 0,
    total: -1,
    isLoading: false,
    columns: options.columns,
    items: [],
    sorting: {
      key: null,
      reverse: false,
    } as ISortState,
  },

  getters: {
    columns(state) {
      return state.columns;
    },

    items(state) {
      return state.items;
    },

    total(state) {
      return state.total;
    },
  },

  mutations: {
    fetchStart: state => {
      state.isLoading = true;
    },

    fetchEnd: state => {
      state.isLoading = false;
    },

    fetchComplete: (state, {items, total}) => {
      state.items = items;
      state.total = total;
    },
  },

  actions: {
    async fetchItems({state, commit}, args: IFetchItemsPayload) {
      type Range = [number, number];

      let items = args.clear ? [] : state.items;

      let has: Range = [state.skip, state.skip + items.length];
      let needs: Range = [args.firstRow, args.lastRow + 1];

      if (has[0] <= needs[0] && has[1] >= needs[1])
        return;

      const chunkSize = 50;

      let needChunks = [Math.floor(needs[0] / chunkSize) * chunkSize, Math.ceil(needs[1] / chunkSize) * chunkSize];

      let prepend: Range | null = null;
      let append: Range | null = null;
      if (needs[0] < has[0]) {
        prepend = [needChunks[0], has[0]];
      }
      if (needs[1] > has[1]) {
        append = [has[1], needChunks[1]];
      }

      console.log('has', has[0], has[1]);
      console.log('needs', needs[0], needs[1]);
      if (prepend !== null) console.log('prepend', prepend[0], prepend[1]);
      if (append !== null) console.log('append', append[0], append[1]);

      commit('fetchStart');

      // if (prepend !== null) {
      //   let skip = prepend[0];
      //   let take = prepend[1] - prepend[0];
      //   let result = await options.fetch(skip, take, state.sorting);
      //   state.skip = skip; // XXX
      //   items = result.items.concat(items);
      // }

      if (append !== null) {
        let skip = append[0];
        let take = append[1] - append[0];
        // skip = Math.max(skip, this.skip + this.items.length);
        let result = await options.fetch(skip, take, state.sorting);
        items = items.concat(result.items);

        commit('fetchComplete', {items, total: result.total});
      }

      commit('fetchEnd');
    },
  },

});
