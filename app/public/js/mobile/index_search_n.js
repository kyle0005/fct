Vue.component('head-sorts',
  {
    template: '#head_sorts',
    computed: {
    },
    mounted: function() {
      let vue = this;
      vue.getTypeList();
    },
    props: {

    },
    data() {
      return {
        open: false,
        docked: false,
        transitionName: 'slide-left',
        typeList: config.search.sorts,
      }
    },
    methods: {
      change(code) {
        let vue = this;
        vue.$emit('changelist',code);
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
      getTypeList() {
        let vue = this;
        vue.typeList = config.search.sorts;

      },
    },
    components: {
    }
  }
);
Vue.component('head-artists',
  {
    template: '#head_artists',
    computed: {
    },
    mounted: function() {
      let vue = this;
      vue.getTypeList();
    },
    data() {
      return {
        open: false,
        docked: false,
        transitionName: 'slide-left',
        typeList: [],
      }
    },
    methods: {
      change(code) {
        let vue = this;
          vue.$emit('changelist',code);
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
      getTypeList() {
        let vue = this;
        vue.typeList = config.search.artists;

      },
    },
    components: {
    }
  }
);
Vue.component('head-pricesorts',
  {
    template: '#head_priceSorts',
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
        // img_url: 'public/img/mobile',
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
Vue.component('head-volumes',
  {
    template: '#head_volumes',
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
        // img_url: 'public/img/mobile',
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
let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false)
    },
    data: {
      showTop: false,
      search: config.keyword,
      isearch: config.isearch
    },
    watch: {

    },
    methods: {
      subSearch(){
        let vue = this;
        vue.nodata = false;
        let _url = config.searchUrl;
        if(vue.search){
          tools.ajaxGet(_url + vue.search, vue.searchSuc, vue.getBefore);
        }

      },
      getBefore(){
        let vue = this;
      },
      searchSuc(data){
        let vue = this;
        vue.isearch = data.data;
      },
      end(){
        console.log('end')
      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
    },
  }
).$mount('#isearch');
