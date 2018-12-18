import { mount, config } from '@vue/test-utils';
import SDropDown from '@/components/SDropDown.vue';

config.logModifiedComponents = false;

describe('SDropDown', () => {
  it('renders dropdown list', () => {
    const wrapper = mount(SDropDown, {
      propsData: {
        items: [
          {title: 'Norge'},
          {title: 'Sverige'},
          {title: 'England'},
        ],
        label: 'Choose country',
      },
    });
    // Open menu
    wrapper.find('.s-drop-down__caret').trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders filtered list', async () => {
    const wrapper = mount(SDropDown, {
      propsData: {
        search: true,
        items: [
          {title: 'Norge'},
          {title: 'Sverige'},
          {title: 'England'},
        ],
        label: 'Choose country',
      },
    });
    // Open menu
    let input = wrapper.find('input');
    input.trigger('click');
    input.setValue('sve');
    input.trigger('change');

    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });
});
