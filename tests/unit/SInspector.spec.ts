import { mount, TransitionStub } from '@vue/test-utils';
import SInspector from '@/components/SInspector.vue';
import SInspectorPage from '@/components/SInspectorPage.vue';

describe('SInspector', () => {
  let wrapper : any;
  beforeAll(() => {
    wrapper = mount({
      props: ['show'],
      template: `
      <s-inspector :show="show">
        <s-inspector-page>
          <template v-slot:header>Header</template>
          <template v-slot>Content</template>
          <template v-slot:footer>Footer</template>
        </s-inspector-page>
      </s-inspector>
      `,
      components: {
        's-inspector': SInspector,
        's-inspector-page': SInspectorPage,
      },
    }, {
      propsData: {
        show: true,
      },
      stubs: {
        transition: TransitionStub,
      },
    });
  });

  it('inspector is visible and show header, content and footer content', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('inspector is not showing', () => {
    wrapper.setProps({ show: false });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
