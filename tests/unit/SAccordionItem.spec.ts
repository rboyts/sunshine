import { mount } from '@vue/test-utils';
import SAccordionItem from '@/components/SAccordionItem.vue';
import SIcon from '@/components/SIcon.vue';

let wrapper : any;

// Creating a stub for SAccordion.
beforeAll(() => {
  const parent = {
    components: {
      SIcon,
    },
    methods: {
      registerItem(item : any) {},
    },
  };

  const item = '<h1>Test</h1>';
  wrapper = mount(SAccordionItem, {
    parentComponent: parent,
    slots: {
      heading: 'This is a header',
      default: item,
    },
  });
});

describe('SAccordionItem', () => {
  it('renders text in header and default slot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('show content of inner slot when clicked', async () => {
    wrapper.find('a').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.s-accordion-item__body--open')).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('hides content of inner slot when clicked again', async () => {
    wrapper.find('a').trigger('click');
    await wrapper.vm.$nextTick();
    // expect(wrapper.find('display')).toEqual('none');
    //
    // display shows "". In the snapshot the class is s-accordion-item__body--transitioning"
    // and style="height: 0px; opacity: 0;"
    // Seems like we're getting a snapshot of the transition between open -> close

    expect(wrapper.html()).toMatchSnapshot();
  });
});
