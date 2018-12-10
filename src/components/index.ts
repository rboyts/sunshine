import { VueConstructor } from 'vue';

import '@/style/style.scss';

import UiAccordion from './UiAccordion.vue';
import UiAccordionItem from './UiAccordionItem.vue';
import UiAlert from './UiAlert.vue';
import UiBaseInput from './UiBaseInput.vue';
import UiButton from './UiButton.vue';
import UiCalendar from './UiCalendar.vue';
import UiCheckbox from './UiCheckbox.vue';
import UiDataTable from './UiDataTable.vue';
import UiIcon from './UiIcon.vue';
import UiInspector from './UiInspector.vue';
import UiMenu from './UiMenu.vue';
// import UiPieChart from './UiPieChart.vue';
import UiRadioButton from './UiRadioButton.vue';
import UiRadioGroup from './UiRadioGroup.vue';
import UiSelect from './UiSelect.vue';
import UiTab from './UiTab.vue';
import UiTabs from './UiTabs.vue';
import UiTextField from './UiTextField.vue';

export default {
  install: (Vue: VueConstructor) => {
    Vue.component('ui-button', UiButton);
    Vue.component('ui-accordion', UiAccordion);
    Vue.component('ui-accordion-item', UiAccordionItem);
    Vue.component('ui-alert', UiAlert);
    Vue.component('ui-base-input', UiBaseInput);
    Vue.component('ui-button', UiButton);
    Vue.component('ui-calendar', UiCalendar);
    Vue.component('ui-checkbox', UiCheckbox);
    Vue.component('ui-data-table', UiDataTable);
    Vue.component('ui-icon', UiIcon);
    Vue.component('ui-inspector', UiInspector);
    Vue.component('ui-menu', UiMenu);
    // Vue.component('ui-pie-chart', UiPieChart);
    Vue.component('ui-radio-button', UiRadioButton);
    Vue.component('ui-radio-group', UiRadioGroup);
    Vue.component('ui-select', UiSelect);
    Vue.component('ui-tab', UiTab);
    Vue.component('ui-tabs', UiTabs);
    Vue.component('ui-text-field', UiTextField);
  },
};
