import { mount, config } from '@vue/test-utils';
import SCheckbox from '@/components/SCheckbox.vue';

config.logModifiedComponents = false;

describe('SCheckbox', () => {
  it('renders checkbox', () => {
    const wrapper = mount(SCheckbox, {
      propsData: {
        checked: true,
      },
      slots: {
        default: 'I am a checkbox',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits input', () => {
    const wrapper = mount(SCheckbox, {
      propsData: {
        checked: false,
      },
      slots: {
        default: 'I am a checkbox',
      },
    });

    wrapper.trigger('click');
    expect(wrapper.emitted('change')[0]).toEqual([true]);
  });
});
