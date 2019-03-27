import { mount, TransitionStub } from '@vue/test-utils';
import SInspector from '@/components/SInspector.vue';

describe('SInspector', () => {
  let wrapper : any;
  beforeAll(() => {
    wrapper = mount(SInspector, {
      stubs: {
        transition: TransitionStub,
      },
      propsData: {
        value: true,
      },
      slots: {
        header: 'Header',
        default: 'Content',
        footer: 'Footer',
      },
    });
  });

  it('inspector is visible and show header, content and footer content', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('inspector is not showing', () => {
    wrapper.setProps({ value: false });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
