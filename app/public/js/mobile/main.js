let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
    },
    data: {
      ranks_list: config.productsRank,
      pro_list: [],
      loading: false,
      refreshing: false,
      msg: 0,
      isindex: config.isindex,
      code: '',
      _code: '',
      tab_num: null,

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,

      isADShow: config.isADShow,

      pager_url: '?level_id=0',
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.products.pager
    },
    watch: {
      pro_list: function (val, oldVal) {
        if(!this.listloading){
          if(this.pro_list && this.pro_list.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      initData(){
        let vue = this;
        vue.pro_list = config.products.entries;
        vue.listloading = false;
        vue.tab_num = 0;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      /* 菜单分类加载 */
      getprolist(code, level_id, index) {
        let vue = this;
        vue.tab_num = index || 0;
        vue.pro_list = {};
        vue.nodata = false;

        let _url = '';
        code = code || '';
        level_id = level_id || 0;
        if (code != '') {
          _url = '?code=' + code;
          if (level_id > 0) {
            _url += '&level_id=' + level_id;
          }
        } else {
          if (level_id >= 0) {
            code = vue.code;
            _url = '?level_id=' + level_id;
            if (code != '') {
              _url += '&code=' + code;
            }
          }
        }
        vue._code = code;
        _url = config.product_url + _url;
        vue.pager_url = _url;
        tools.ajaxGet(_url, vue.getSucc, vue.getBefore);

      },
      getSucc(data){
        let vue = this;
        vue.pro_list = data.data.entries;
        vue.pager = data.data.pager;
        vue.code = vue._code;

        vue.listloading = false;

      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = vue.pager_url + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.pro_list = vue.pro_list.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
      closegift(){
        let vue = this;
        vue.isADShow = false;
      }
    },
  }
).$mount('#main');
