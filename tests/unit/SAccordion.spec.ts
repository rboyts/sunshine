import { shallowMount } from '@vue/test-utils';
import SAccordion from '@/components/SAccordion.vue';

describe('SAccordion', () => {
  it('renders item in slot', () => {
    const item = '<h1>Test</h1>';
    const wrapper = shallowMount(SAccordion, {
      slots: {
        default: item,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
