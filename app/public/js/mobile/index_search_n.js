let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false)
    },
    data: {
      open: false,
      docked: false,
      showPop: 0,
      sorts: config.search.sorts,
      artists: config.search.artists,
      priceSorts: config.search.priceSorts,
      volumes: config.search.volumes,
      categorys: config.search.categorys,

      showTop: false,
      search: config.search.keyword,
      isearch: config.result,


    },
    watch: {

    },
    methods: {
      toggle(num){
        let vue = this;
        if(num !== vue.showPop){
          vue.open = false;
          vue.docked = false;
          vue.showPop = num;
        }
        vue.$nextTick(function () {
          // DOM 更新后回调
          setTimeout(function () {
            vue.docked = !vue.docked;
            vue.open = !vue.open;
          },50)

        });


      },
      change(code) {
        let vue = this;

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
