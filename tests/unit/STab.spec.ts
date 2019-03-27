import { mount, RouterLinkStub } from '@vue/test-utils';
import STab from '@/components/STab.vue';

describe('STab', () => {
  it('renders slot content', () => {
    const wrapper = mount(STab, {
      propsData: {
        to: '?test',
      },
      slots: {
        default: 'Tab 1',
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('has correct routerlink', () => {
    const link = '?test';
    const wrapper = mount(STab, {
      propsData: {
        to: '?test',
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find(RouterLinkStub).props().to).toBe(link);
  });
});
