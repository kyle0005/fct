/**
 * Created by 阿万银 on 2017/6/11.
 */
Vue.component('head-top',
  {
    template: '#head_top',
    computed: {
    },
    mounted: function() {
      this.getTypeList();
    },
    data() {
      return {
        open: false,
        docked: false,
        transitionName: 'slide-left',
        typeList: [],
        loading: false,
        refreshing: false,
        img_url: 'public/images',
        pro_list_type: []
      }
    },
    methods: {
      toIndex(){
        location.href = 'main.html';
      },
      toLogin(){
        location.href = 'login.html';
      },
      change(index) {
        let vue = this;
        vue.$emit('changelist',index);
      },
      toggle() {
        if (!this.open) {
          this.docked = true;
          this.open = true;
        } else {
          this.open = false;
          let vue = this;
          setTimeout(function() {
            vue.docked = false;
          }, 300);
        }
      },
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
      },
      getTypeList() {
        let vue = this;
        vue.typeList = config.productsType;

      },
    },
    components: {
    }
  }
);
