let app = new Vue(
  {
    mounted: function () {
    },
    data: {
      ranks_list: config.productsRank,
      pro_list: config.products,
      loading: false,
      refreshing: false,
      msg: 0,
      isindex: config.isindex,
      code: '',
      tab_num: null,

      listloading: false,
      nodata: false
    },
    methods: {
      showImg(){
        return 'public/images/img_loader.gif';
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      /* 菜单分类加载 */
      getprolist(code, level_id, index) {
        let vue = this;
        vue.tab_num = index;
        vue.nodata = false;
        vue.pro_list = {};

        let _url = '';
        code = code || '';
        level_id = level_id || 0;
        if (code != '') {
          _url = '?code=' + code;
          if (level_id > 0) {
            _url += '&level_id=' + level_id;
          }
        } else {
          if (level_id > 0) {
            code = vue.code;
            _url = '?level_id=' + level_id;
            if (code != '') {
              _url += '&code=' + code;
            }
          }
        }
        _url = config.product_url + _url;
        tools.ajaxGet(_url, vue.getSucc, vue.getBefore);

      },
      getSucc(data){
        let vue = this;
        vue.pro_list = data.data;
        vue.code = code;

        vue.listloading = false;
        if(vue.orderlist.length > 0){
          vue.nodata = false;
        }else {
          vue.nodata = true;
        }

      },
    },
  }
).$mount('#main');
