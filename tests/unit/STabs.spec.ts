import { shallowMount } from '@vue/test-utils';
import STabs from '@/components/STabs.vue';

describe('STabs', () => {
  it('renders content in slot', () => {
    const wrapper = shallowMount(STabs, {
      slots: {
        default: '<h1>Test</h1>',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // Check highlighting on tab changed?
});
