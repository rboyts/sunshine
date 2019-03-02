import { mount, config } from '@vue/test-utils';
import SMenu from '@/components/SMenu.vue';

config.logModifiedComponents = false;

describe('SMenu', () => {
  it('renders dropdown list', () => {
    const wrapper = mount(SMenu, {
      slots: {
        activator: '<button>activator</button>',
        content: '<div>content</div>',
      },
    });

    expect(wrapper.contains('.s-menu__popup')).toBeFalsy();

    wrapper.find('button').element.click();

    expect(wrapper.contains('.s-menu__popup')).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
