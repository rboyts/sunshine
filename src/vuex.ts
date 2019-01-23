import { Module } from 'vuex';
import { Mutex } from 'async-mutex';
import {
  IDataTableState,
  ICreateDataModuleOptions,
  IFetchItemsPayload,
  ISortState,
  IItem,
} from './components/types';
import { joinKeyPath } from './lib/utils';

export interface IShowSubItemsPayload {
  keyPath: string[];
}

const getItems = (keyPath: string[], state: IDataTableState): IItem[] | null => {
  const key = joinKeyPath(keyPath);
  const items = state.items[key];
  if (items == null) return null;

  const nodes = items.map((item: IItem) => {
    let itemKeyPath = keyPath.concat(item.key);
    let children = item.totalChildren ? getItems(itemKeyPath, state) : [];
    return {
      ...item,
      children,
    };
  });
  return nodes;
};

export const createDataModule = <RootState = any>(options: ICreateDataModuleOptions<RootState>):
    Module<IDataTableState, RootState> => {

  const mutex = new Mutex();

  return {
    namespaced: true,

    state() {
      return {
        offset: 0,
        total: null,
        isLoading: false,
        columns: options.columns,
        items: {'': []},
        sorting: {
          key: null,
          reverse: false,
        } as ISortState,
      };
    },

    getters: {
      columns(state) {
        return state.columns;
      },

      items(state) {
        return getItems([], state);
      },

      skip(state) {
        return state.offset;
      },

      total(state) {
        return state.total;
      },

      sorting(state) {
        return state.sorting;
      },
    },

    mutations: {
      sorting: (state, sorting: ISortState) => {
        state.sorting = sorting;
      },

      fetchStart: state => {
        state.isLoading = true;
      },

      fetchEnd: state => {
        state.isLoading = false;
      },

      fetchItemsComplete: (state, {items, offset, total}) => {
        state.items = {
          ...state.items,
          ['']: items,
        };
        state.offset = offset;
        state.total = total;
      },

      fetchSubItemsComplete: (state, {keyPath, items, total}) => {
        const key = joinKeyPath(keyPath);
        state.items = {
          ...state.items,
          [key]: items,
        };
      },
    },

    actions: {
      sort({state, commit, dispatch}, key: string) {
        const sorting = state.sorting.key === key ?
          { ...state.sorting, reverse: !state.sorting.reverse } :
          { key, reverse: false };

        commit('sorting', sorting);
        dispatch('init');
      },

      init({dispatch}) {
        dispatch('fetchItems', {firstRow: 0, lastRow: 50, clear: true});
      },

      async fetchItems({dispatch}, args: IFetchItemsPayload) {
        // Wait until any previous requests are completed
        await mutex.runExclusive(() => dispatch('doFetchItems', args));
      },

      async doFetchItems(context, args: IFetchItemsPayload) {
        const { state, commit } = context;

        // if (args.firstRow > 0) return;
        type Range = [number, number];

        let items = args.clear ? [] : state.items[''];

        let has: Range = [state.offset, state.offset + items.length];
        let needs: Range = [args.firstRow, args.lastRow + 1];

        console.log('args', args);

        if (has[0] <= needs[0] && has[1] >= needs[1]) {
          console.info('Fetch not needed', args);
          return;
        }

        if (state.isLoading) {
          console.error('Store is already loading data', args);
          return;
        }

        const chunkSize = options.chunkSize || 50;

        let needChunks = [Math.floor(needs[0] / chunkSize) * chunkSize, Math.ceil(needs[1] / chunkSize) * chunkSize];

        let prepend: Range | null = null;
        let append: Range | null = null;
        if (needs[0] < has[0]) {
          prepend = [needChunks[0], has[0]];
        }
        if (needs[1] > has[1]) {
          if (needChunks[0] > has[1]) {
            items = [];
            append = [needChunks[0], needChunks[1]];
          } else {
            append = [has[1], needChunks[1]];
          }
        }

        // console.log('has', has[0], has[1]);
        // console.log('needs', needs[0], needs[1]);
        if (prepend !== null) console.log('prepend', prepend[0], prepend[1]);
        if (append !== null) console.log('append', append[0], append[1]);

        commit('fetchStart');

        if (prepend !== null) {
          let skip = prepend[0];
          let take = prepend[1] - prepend[0];
          let result = await options.fetch(skip, take, state.sorting, context);
          let offset = skip;
          items = result.items.concat(items);
          commit('fetchItemsComplete', {items, offset, total: result.total});
        }

        if (append !== null) {
          try {
            let skip = append[0];
            let take = append[1] - append[0];
            let result = await options.fetch(skip, take, state.sorting, context);
            let offset = skip - items.length;
            items = items.concat(result.items);

            // console.log(`got ${result.items.length} of ${result.total}`);

            commit('fetchItemsComplete', {items, offset, total: result.total});
          } catch (ex) {
            console.error('Fetch failed', ex);
          }
        }

        commit('fetchEnd');
      },

      async showSubItems({state, commit}, {keyPath}: IShowSubItemsPayload) {
        // Already loaded?
        if (joinKeyPath(keyPath) in state.items) return;

        if (!options.fetchChildren) return;

        const result = await options.fetchChildren(keyPath);

        commit('fetchSubItemsComplete', { keyPath, items: result.items, total: result.total });
      },
    },
  };
};
