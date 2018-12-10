import { VueConstructor } from 'vue';

import './style/style.scss';

import UiAccordion from './components/UiAccordion.vue';
import UiAccordionItem from './components/UiAccordionItem.vue';
import UiAlert from './components/UiAlert.vue';
import UiBaseInput from './components/UiBaseInput.vue';
import UiButton from './components/UiButton.vue';
import UiCalendar from './components/UiCalendar.vue';
import UiCheckbox from './components/UiCheckbox.vue';
import UiDataTable from './components/UiDataTable.vue';
import UiIcon from './components/UiIcon.vue';
import UiInspector from './components/UiInspector.vue';
import UiMenu from './components/UiMenu.vue';
import UiPieChart from './components/UiPieChart.vue';
import UiRadioButton from './components/UiRadioButton.vue';
import UiRadioGroup from './components/UiRadioGroup.vue';
import UiSelect from './components/UiSelect.vue';
import UiTab from './components/UiTab.vue';
import UiTabs from './components/UiTabs.vue';
import UiTextField from './components/UiTextField.vue';

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
    Vue.component('ui-pie-chart', UiPieChart);
    Vue.component('ui-radio-button', UiRadioButton);
    Vue.component('ui-radio-group', UiRadioGroup);
    Vue.component('ui-select', UiSelect);
    Vue.component('ui-tab', UiTab);
    Vue.component('ui-tabs', UiTabs);
    Vue.component('ui-text-field', UiTextField);
  },
};
