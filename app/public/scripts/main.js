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
      code: ""
    },
    methods: {
      /* 菜单分类加载 */
      getprolist(code, level_id) {
        let vue = this;
        let _url = config.product_url;
        code = code || "";
        level_id = level_id || "";
        if(code == "" && vue.code !== ""){
          _url += '?code=' + vue.code + '&level_id=' + level_id;
        } else {
          _url += '?code=' + code + '&level_id=' + level_id;
        }
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
                console.log(code + "+" + level_id)
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
