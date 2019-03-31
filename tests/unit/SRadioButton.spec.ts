import { shallowMount } from '@vue/test-utils';
import SRadioButton from '@/components/SRadioButton.vue';

let wrapper : any;
beforeAll(() => {
  wrapper = shallowMount(SRadioButton, {
    propsData: {
      value: 'test',
      checked: false,
    },
  });
});

describe('SRadioButton', () => {
  it('render unchecked', () => {
    expect(wrapper.find('.s-radio-button__selected').exists()).toBeFalsy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render checked dot when selected', () => {
    wrapper.find('input').setChecked();
    expect(wrapper.find('.s-radio-button__selected').exists()).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('slot content is rendered', () => {
    const _wrapper = shallowMount(SRadioButton, {
      slots: {
        default: '<h1>Test</h1>',
      },
    });

    expect(_wrapper.html()).toMatchSnapshot();
  });

  it('emits value when clicked', () => {
    wrapper.find('input').setChecked();
    expect(wrapper.emitted('input')[0][0]).toBe('test');
  });

  it('render checked', () => {
    const _wrapper = shallowMount(SRadioButton, {
      propsData: {
        value: 'test',
        choice: 'test',
      },
    });
    expect(_wrapper.find('.s-radio-button__selected').exists()).toBeTruthy();
    expect(_wrapper.html()).toMatchSnapshot();
  });
});
