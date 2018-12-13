import { VueConstructor } from 'vue';

import './style/style.scss';

import SAccordion from './components/SAccordion.vue';
import SAccordionItem from './components/SAccordionItem.vue';
import SAlert from './components/SAlert.vue';
import SBaseInput from './components/SBaseInput.vue';
import SButton from './components/SButton.vue';
import SCalendar from './components/SCalendar.vue';
import SCheckbox from './components/SCheckbox.vue';
import SDataTable from './components/SDataTable.vue';
import SDropDown from './components/SDropDown.vue';
import SIcon from './components/SIcon.vue';
import SInspector from './components/SInspector.vue';
import SList from './components/SList.vue';
import SListItem from './components/SListItem.vue';
import SMenu from './components/SMenu.vue';
import SPieChart from './components/SPieChart.vue';
import SRadioButton from './components/SRadioButton.vue';
import SRadioGroup from './components/SRadioGroup.vue';
import SSelect from './components/SSelect.vue';
import STab from './components/STab.vue';
import STabs from './components/STabs.vue';
import STextField from './components/STextField.vue';

const plugin = {
  install: (Vue: VueConstructor) => {
    Vue.component('s-button', SButton);
    Vue.component('s-accordion', SAccordion);
    Vue.component('s-accordion-item', SAccordionItem);
    Vue.component('s-alert', SAlert);
    Vue.component('s-base-input', SBaseInput);
    Vue.component('s-calendar', SCalendar);
    Vue.component('s-checkbox', SCheckbox);
    Vue.component('s-data-table', SDataTable);
    Vue.component('s-drop-down', SDropDown);
    Vue.component('s-icon', SIcon);
    Vue.component('s-inspector', SInspector);
    Vue.component('s-list', SList);
    Vue.component('s-list-item', SListItem);
    Vue.component('s-menu', SMenu);
    Vue.component('s-pie-chart', SPieChart);
    Vue.component('s-radio-button', SRadioButton);
    Vue.component('s-radio-group', SRadioGroup);
    Vue.component('s-select', SSelect);
    Vue.component('s-tab', STab);
    Vue.component('s-tabs', STabs);
    Vue.component('s-text-field', STextField);
  },
};

export default plugin;
