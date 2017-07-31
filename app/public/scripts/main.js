var app = new Vue(
  {
    mounted: function() {
      var key = tools.getUrlKey();
      console.log(key)
    },
    data: {
      ranks_list: config.productsRank,
      pro_list: config.products,
      loading: false,
      refreshing: false,
      msg: 0,
      isindex: config.isindex,
      code: '',
      tab_num: 0
    },
    methods: {
      /* 菜单分类加载 */
      getprolist(code, level_id, index) {
        let vue = this;
        vue.tab_num = index;

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
        jAjax({
          type:'get',
          url:_url,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.pro_list = data.data;
                vue.code = code;
              }else {
                console.log('false')
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },

      /* 滚动分页加载 */
      getprolistbypage(msg) {

      },
    },
  }
).$mount('#main');
