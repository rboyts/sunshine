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
    expect(wrapper.contains('.s-checkable__checkmark')).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('changes state', () => {
    const wrapper = mount(SCheckbox, {
      slots: {
        default: 'I am a checkbox',
      },
    });

    expect(wrapper.contains('.s-checkable__checkmark')).toBeFalsy();
    wrapper.element.click();
    expect(wrapper.contains('.s-checkable__checkmark')).toBeTruthy();
  });

  it('shows multiple state', () => {
    const wrapper = mount(SCheckbox, {
      propsData: {
        checked: null,
      },
      slots: {
        default: 'I am a checkbox',
      },
    });

    expect(wrapper.contains('.s-checkable__checkmark')).toBeTruthy();
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
