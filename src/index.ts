import { VueConstructor } from 'vue';

import './style/style.scss';

import SAccordion from './components/SAccordion.vue';
import SAccordionItem from './components/SAccordionItem.vue';
import SAlert from './components/SAlert.vue';
import SBaseInput from './components/SBaseInput.vue';
import SButton from './components/SButton.vue';
import SCalendar from './components/SCalendar.vue';
import SCheckbox from './components/SCheckbox.vue';
import SDialog from './components/SDialog.vue';
import SDropDown from './components/SDropDown.vue';
import SFilterDropDown from './components/SFilterDropDown.vue';
import SGrid from './components/SGrid.vue';
import SGridItem from './components/SGridItem.vue';
import SIcon from './components/SIcon.vue';
import SInspector from './components/SInspector.vue';
import SList from './components/SList.vue';
import SListItem from './components/SListItem.vue';
import SListSeparator from './components/SListSeparator.vue';
import SMenu from './components/SMenu.vue';
import SPieChart from './components/SPieChart.vue';
import SProgress from './components/SProgress.vue';
import SRadioButton from './components/SRadioButton.vue';
import SSavedSetups from './components/SSavedSetups.vue';
import STab from './components/STab.vue';
import STable from './components/STable/STable.vue';
import STabs from './components/STabs.vue';
import STextField from './components/STextField.vue';
import STextArea from './components/STextArea.vue';
import SDatepicker from './components/SDatepicker.vue';

export { get } from './lib/utils';
export * from './components/types';

export {
  SAccordion,
  SAccordionItem,
  SAlert,
  SBaseInput,
  SButton,
  SCalendar,
  SCheckbox,
  SDatepicker,
  SDropDown,
  SGrid,
  SGridItem,
  SIcon,
  SInspector,
  SList,
  SListItem,
  SListSeparator,
  SMenu,
  SPieChart,
  SProgress,
  SRadioButton,
  STab,
  STable,
  STabs,
  STextField,
};

const plugin = {
  install: (Vue: VueConstructor) => {
    Vue.component('s-button', SButton);
    Vue.component('s-accordion', SAccordion);
    Vue.component('s-accordion-item', SAccordionItem);
    Vue.component('s-alert', SAlert);
    Vue.component('s-base-input', SBaseInput);
    Vue.component('s-calendar', SCalendar);
    Vue.component('s-checkbox', SCheckbox);
    Vue.component('s-dialog', SDialog);
    Vue.component('s-drop-down', SDropDown);
    Vue.component('s-filter-drop-down', SFilterDropDown);
    Vue.component('s-grid', SGrid);
    Vue.component('s-grid-item', SGridItem);
    Vue.component('s-icon', SIcon);
    Vue.component('s-inspector', SInspector);
    Vue.component('s-list', SList);
    Vue.component('s-list-item', SListItem);
    Vue.component('s-list-separator', SListSeparator);
    Vue.component('s-menu', SMenu);
    Vue.component('s-pie-chart', SPieChart);
    Vue.component('s-progress', SProgress);
    Vue.component('s-radio-button', SRadioButton);
    Vue.component('s-saved-setups', SSavedSetups);
    Vue.component('s-tab', STab);
    Vue.component('s-table', STable);
    Vue.component('s-tabs', STabs);
    Vue.component('s-text-field', STextField);
    Vue.component('s-text-area', STextArea);
    Vue.component('s-datepicker', SDatepicker);
  },
};

export default plugin;
