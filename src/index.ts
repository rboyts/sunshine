/* eslint-disable no-param-reassign */

import { VueConstructor } from 'vue';

import './style/style.scss';

import SAccordion from './components/SAccordion.vue';
import SAccordionItem from './components/SAccordionItem.vue';
import SAlert from './components/SAlert.vue';
import SBaseInput from './components/SBaseInput.vue';
import SBreadcrumb from './components/SBreadcrumb.vue';
import SButton from './components/SButton.vue';
import SCalendar from './components/SCalendar.vue';
import SCheckbox from './components/SCheckbox.vue';
import SDateRange from './components/SDatepicker/SDateRange.vue';
import SDateSingle from './components/SDatepicker/SDateSingle.vue';
import SDialog from './components/SDialog.vue';
import SDropDown from './components/SDropDown.vue';
import SFilterDropDown from './components/SFilterDropDown.vue';
import SGrid from './components/SGrid.vue';
import SGridItem from './components/SGridItem.vue';
import SIcon from './components/SIcon.vue';
import SInspector from './components/SInspector.vue';
import SInspectorPage from './components/SInspectorPage.vue';
import SList from './components/SList.vue';
import SListItem from './components/SListItem.vue';
import SListSeparator from './components/SListSeparator.vue';
import SMenu from './components/SMenu.vue';
import SMenuList from './components/SMenuList.vue';
import SMenuBuilder from './components/SMenuBuilder.vue';
import SMultiselect from './components/SMultiselect.vue';
import SPageLayout from './components/SPageLayout.vue';
import SPieChart from './components/SPieChart.vue';
import SProgress from './components/SProgress.vue';
import SRadioButton from './components/SRadioButton.vue';
import SSavedSetups from './components/SSavedSetups.vue';
import STab from './components/STab.vue';
import STable from './components/STable/STable.vue';
import STableColumnsMenu from './components/STable/STableColumnsMenu.vue';
import STabs from './components/STabs.vue';
import STextArea from './components/STextArea.vue';
import STextField from './components/STextField.vue';
import SToolMenuButton from './components/SToolMenuButton.vue';
import STableNoResults from './components/STable/STableNoResults.vue';
import classHelper from './lib/classHelper';

export { get } from './lib/utils';
export * from './components/types';

export {
  SAccordion,
  SAccordionItem,
  SAlert,
  SBaseInput,
  SBreadcrumb,
  SButton,
  SCalendar,
  SCheckbox,
  SDateRange,
  SDateSingle,
  SDropDown,
  SGrid,
  SGridItem,
  SIcon,
  SInspector,
  SInspectorPage,
  SList,
  SListItem,
  SListSeparator,
  SMenu,
  SMenuList,
  SMenuBuilder,
  SMultiselect,
  SPageLayout,
  SPieChart,
  SProgress,
  SRadioButton,
  STab,
  STable,
  STableColumnsMenu,
  STabs,
  STextField,
  SToolMenuButton,
  STableNoResults,
};

const plugin = {
  install: (Vue: VueConstructor) => {
    // Add '$class' helper
    Vue.prototype.$class = classHelper;

    Vue.component('s-accordion', SAccordion);
    Vue.component('s-accordion-item', SAccordionItem);
    Vue.component('s-alert', SAlert);
    Vue.component('s-base-input', SBaseInput);
    Vue.component('s-breadcrumb', SBreadcrumb);
    Vue.component('s-button', SButton);
    Vue.component('s-calendar', SCalendar);
    Vue.component('s-checkbox', SCheckbox);
    Vue.component('s-date-range', SDateRange);
    Vue.component('s-date-single', SDateSingle);
    Vue.component('s-dialog', SDialog);
    Vue.component('s-drop-down', SDropDown);
    Vue.component('s-filter-drop-down', SFilterDropDown);
    Vue.component('s-grid', SGrid);
    Vue.component('s-grid-item', SGridItem);
    Vue.component('s-icon', SIcon);
    Vue.component('s-inspector', SInspector);
    Vue.component('s-inspector-page', SInspectorPage);
    Vue.component('s-list', SList);
    Vue.component('s-list-item', SListItem);
    Vue.component('s-list-separator', SListSeparator);
    Vue.component('s-menu', SMenu);
    Vue.component('s-menu-list', SMenuList);
    Vue.component('s-menu-builder', SMenuBuilder);
    Vue.component('s-multiselect', SMultiselect);
    Vue.component('s-page-layout', SPageLayout);
    Vue.component('s-pie-chart', SPieChart);
    Vue.component('s-progress', SProgress);
    Vue.component('s-radio-button', SRadioButton);
    Vue.component('s-saved-setups', SSavedSetups);
    Vue.component('s-tab', STab);
    Vue.component('s-table', STable);
    Vue.component('s-table-columns-menu', STableColumnsMenu);
    Vue.component('s-tabs', STabs);
    Vue.component('s-text-area', STextArea);
    Vue.component('s-text-field', STextField);
    Vue.component('s-tool-menu-button', SToolMenuButton);
    Vue.component('s-table-no-results', STableNoResults);
  },
};

export default plugin;
