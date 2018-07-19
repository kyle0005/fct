let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false);
      vue.isearch = config.isearch;
      vue.listloading = false;
    },
    data: {
      showTop: false,
      search: config.keyword,
      isearch: [],
      nodata: false,
      listloading: true,
    },
    watch: {
      isearch: function (val, oldVal) {
        if(!this.listloading){
          if(this.isearch && this.isearch.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      clear(){
        let vue = this;
        vue.search = '';
      },
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
        vue.listloading = true;
      },
      searchSuc(data){
        let vue = this;
        vue.isearch = data.data;
        vue.listloading = false;
      },
      end(){

      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
    },
  }
).$mount('#isearch');
