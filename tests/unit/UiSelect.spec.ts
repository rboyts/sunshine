import { mount, config } from '@vue/test-utils';
import UiSelect from '@/components/UiSelect.vue';

config.logModifiedComponents = false;

describe('UiSelect', () => {
  it('renders select box', () => {
    const wrapper = mount(UiSelect, {
      propsData: {
        items: [
          {title: 'Norge'},
          {title: 'Sverige'},
          {title: 'England'},
        ],
        label: 'Choose country',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
