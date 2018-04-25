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
      search: '',
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
