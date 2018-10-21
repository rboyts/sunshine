import Vue from 'vue';
import Router from 'vue-router';
import TableDemo from '@/views/TableDemo.vue';
import ChartDemo from '@/views/ChartDemo.vue';
import CalendarDemo from '@/views/CalendarDemo.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'table',
      component: TableDemo,
    },
    {
      path: '/chart',
      name: 'chart',
      component: ChartDemo,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarDemo,
    },
  ],
});
