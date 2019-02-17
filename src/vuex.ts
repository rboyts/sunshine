import { Module } from 'vuex';
import { Mutex } from 'async-mutex';
import {
  IDataTableState,
  IRequestLoadItemsPayload,
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
    let subItems = item.subItems || (item.subItems === null ? getItems(itemKeyPath, state) : []);
    return {
      ...item,
      subItems,
    };
  });
  return nodes;
};


export const createDataModule = <ModuleState = {}, RootState = any>(options: Module<ModuleState, RootState>):
    Module<ModuleState & IDataTableState, RootState> => {

  const mutex = new Mutex();

  return {
    namespaced: true,

    state() {
      const moduleState = options.state instanceof Function ? options.state() : options.state;

      return {
        offset: 0,
        total: null,
        isLoading: false,
        items: {'': []},
        sorting: {
          key: null,
          reverse: false,
        } as ISortState,

        ...(moduleState || {} as ModuleState),
      };
    },

    modules: {
      ...options.modules,
    },

    getters: {
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

      ...options.getters,
    },

    mutations: {
      sorting: (state, key: string) => {
        state.sorting = {
          key,
          reverse: state.sorting.key === key ? !state.sorting.reverse : false,
        };
      },

      loadStart: state => {
        state.isLoading = true;
      },

      loadEnd: state => {
        state.isLoading = false;
      },

      loadItemsComplete: (state, {items, offset, total}) => {
        state.items = {
          ...state.items,
          ['']: items,
        };
        state.offset = offset;
        state.total = total;
      },

      loadSubItemsComplete: (state, {keyPath, items, total}) => {
        const key = joinKeyPath(keyPath);
        state.items = {
          ...state.items,
          [key]: items,
        };
      },

      ...options.mutations,
    },

    actions: {
      async sort({commit, dispatch}, key: string) {
        commit('sorting', key);
        await dispatch('init');
      },

      async init({dispatch}) {
        await dispatch('requestLoadItems', {firstRow: 0, lastRow: 49, clear: true});
      },

      async requestLoadItems({dispatch}, payload: IRequestLoadItemsPayload) {
        // Wait until any previous requests are completed
        await mutex.runExclusive(() => dispatch('_doRequestLoadItems', payload));
      },

      async _doRequestLoadItems({state, commit, dispatch}, payload: IRequestLoadItemsPayload) {
        type Range = [number, number];

        let items = payload.clear ? [] : state.items[''];

        let has: Range = [state.offset, state.offset + items.length];
        let needs: Range = [payload.firstRow, payload.lastRow + 1];

        if (has[0] <= needs[0] && has[1] >= needs[1]) {
          console.info('Loading not needed', payload);
          return;
        }

        if (state.isLoading) {
          console.error('Store is already loading data', payload);
          return;
        }

        const chunkSize = 50;

        let needChunks = [Math.floor(needs[0] / chunkSize) * chunkSize, Math.ceil(needs[1] / chunkSize) * chunkSize];

        let prepend: Range | null = null;
        let append: Range | null = null;
        if (needs[0] < has[0]) {
          if (needChunks[1] < has[0]) {
            items = [];
            append = [needChunks[0], needChunks[1]];
          } else {
            prepend = [needChunks[0], has[0]];
          }
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

        commit('loadStart');

        if (prepend !== null) {
          let skip = prepend[0];
          let take = prepend[1] - prepend[0];
          let result = await dispatch('loadItems', {skip, take});
          let offset = skip;
          items = result.items.concat(items);
          commit('loadItemsComplete', {items, offset, total: result.total});
        }

        if (append !== null) {
          try {
            let skip = append[0];
            let take = append[1] - append[0];
            let result = await dispatch('loadItems', {skip, take});
            let offset = skip - items.length;
            items = items.concat(result.items);

            // console.log(`got ${result.items.length} of ${result.total}`);

            commit('loadItemsComplete', {items, offset, total: result.total});
          } catch (ex) {
            console.error('loadItems failed', ex);
          }
        }

        commit('loadEnd');
      },

      async requestLoadSubItems({dispatch}, payload: IShowSubItemsPayload) {
        // Wait until any previous requests are completed
        await mutex.runExclusive(() => dispatch('_doRequestLoadSubItems', payload));
      },

      async _doRequestLoadSubItems({state, commit, dispatch}, {keyPath}: IShowSubItemsPayload) {
        // Already loaded?
        if (joinKeyPath(keyPath) in state.items) return;

        const result = await dispatch('loadSubItems', {keyPath});

        commit('loadSubItemsComplete', { keyPath, items: result.items, total: result.total });
      },

      ...options.actions,
    },
  };
};
