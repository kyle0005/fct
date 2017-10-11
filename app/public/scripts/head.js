/**
 * Created by 阿万银 on 2017/6/11.
 */
Vue.component('head-top',
  {
    template: '#head_top',
    computed: {
    },
    mounted: function() {
      let vue = this;
      vue.getTypeList();
    },
    props: {
      isindex: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        open: false,
        docked: false,
        transitionName: 'slide-left',
        typeList: [],
        loading: false,
        refreshing: false,
        img_url: 'public/img/mobile',
        pro_list_type: []
      }
    },
    methods: {
      toIndex(){
        location.href = config.index;
      },
      toLogin(){
        location.href = config.login;
      },
      change(code) {
        let vue = this;
        if(vue.isindex){
          /* 判断为首页 */
          vue.$emit('changelist',code);
        }
        else {
          /* 不为首页 */
          location.href = config.product_url + '?code=' + code;
        }

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
