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
      nodata: false
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
        vue.pro_list = config.products;
        vue.listloading = false;
        vue.tab_num = 0;
      },
      showImg(){
        return 'public/img/mobile/img_loader.gif';
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      /* 菜单分类加载 */
      getprolist(code, level_id, index) {
        let vue = this;
        vue.tab_num = index;
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
        tools.ajaxGet(_url, vue.getSucc, vue.getBefore);

      },
      getSucc(data){
        let vue = this;
        vue.pro_list = data.data;
        vue.code = vue._code;

        vue.listloading = false;

      },
    },
  }
).$mount('#main');
