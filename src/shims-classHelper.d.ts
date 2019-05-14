/* eslint-disable camelcase */

import Vue from 'vue';
import { IClassHelper } from './lib/classHelper';

declare module 'vue/types/vue' {
  interface Vue {
    $class: IClassHelper;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $_className?: string;
  }
}
