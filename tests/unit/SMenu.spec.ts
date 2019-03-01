import { mount, config } from '@vue/test-utils';
import SMenu from '@/components/SMenu.vue';

config.logModifiedComponents = false;

describe('SMenu', () => {
  it('renders dropdown list', () => {
    const wrapper = mount(SMenu, {
      propsData: {
        isOpen: false,
      },
      slots: {
        activator: '<button>activator</button>',
        content: '<div>content</div>',
      },
    });

    expect(wrapper.contains('.s-menu__popup')).toBeFalsy();

    wrapper.setProps({ isOpen: true });

    expect(wrapper.contains('.s-menu__popup')).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
