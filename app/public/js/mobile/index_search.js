let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false)
    },
    data: {
      showTop: false,
      search: '',
      isearch: config.isearch
    },
    watch: {

    },
    methods: {
      initData(){
        let vue = this;

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
