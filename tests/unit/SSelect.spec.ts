import { mount, config } from '@vue/test-utils';
import SSelect from '@/components/SSelect.vue';

config.logModifiedComponents = false;

describe('SSelect', () => {
  it('renders select box', () => {
    const wrapper = mount(SSelect, {
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
