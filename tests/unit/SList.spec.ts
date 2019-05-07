import { mount } from '@vue/test-utils';
import SList from '@/components/SList.vue';

const COUNTRIES = [
  'Argentina',
  'Belgium',
  'Canada',
  'Denmark',
  'France',
  'Germany',
];

const SELECTED = [
  'Belgium',
  'Canada',
];

let items : Array<{}> = [];
let value : Array<String> = [];

beforeAll(() => {
  items = COUNTRIES.map(c => ({ key: c.toLowerCase(), label: c }));
  value = SELECTED.map(c => c.toLowerCase());
});

describe('SList', () => {
  it('renders empty list', () => {
    const wrapper = mount(SList, {
      propsData: {
        items: [],
        value: [],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders list', () => {
    const wrapper = mount(SList, {
      propsData: {
        items,
        value: [],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders list with preselected items', () => {
    const wrapper = mount(SList, {
      propsData: {
        items,
        value,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders list with selected item by click', () => {
    const wrapper = mount(SList, {
      propsData: {
        items,
        value: [],
      },
    });

    const item = wrapper.find('.s-list-item');
    item.element.click();
    expect(wrapper.html()).toMatchSnapshot();
  });


  it('emits selected values', () => {
    const wrapper = mount(SList, {
      propsData: {
        items,
        value,
      },
    });
    const item = wrapper.find('.s-list-item');
    item.element.click();
    expect(wrapper.emitted('input')[0][0]).toEqual(['argentina']);
  });

  it('emits all selected values on ctrl click', () => {
    const wrapper = mount(SList, {
      propsData: {
        items,
        value,
      },
    });
    const item = wrapper.find('.s-list-item');
    item.trigger('click', { ctrlKey: true });
    expect(wrapper.emitted('input')[0][0]).toEqual(['belgium', 'canada', 'argentina']);
  });
});
