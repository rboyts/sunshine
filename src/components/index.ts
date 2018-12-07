import { VueConstructor } from 'vue';
import UiButton from './UiButton.vue';

const plugin = (vue: VueConstructor) => {
  vue.component('ui-button', UiButton);
};

export default plugin;
