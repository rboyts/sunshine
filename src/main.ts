import Vue from 'vue';
import App from './App.vue';
import router from './router';
import components from './components';

import './style/style.scss';

Vue.config.productionTip = false;

Vue.use(components);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
