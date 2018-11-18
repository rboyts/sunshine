import Vue from 'vue';
import Router from 'vue-router';
import BasicDemo from '@/views/BasicDemo.vue';
import AlertsDemo from '@/views/AlertsDemo.vue';
import AccordionDemo from '@/views/AccordionDemo.vue';
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
      name: 'home',
      component: BasicDemo,
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: AlertsDemo,
    },
    {
      path: '/accordion',
      name: 'accordion',
      component: AccordionDemo,
    },
    {
      path: '/table',
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
