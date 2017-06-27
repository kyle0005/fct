var app = new Vue(
  {
    mounted: function() {
      this.getRankList();
      this.getProFirst();
    },
    data: {
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      img_url: 'public/images',
      msg: 0
    },
    methods: {
      change(index) {
        let vue = this;
        let _url = apis.products;
        if(index >= 0){
          _url += '?rank_id=' + index;
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
              console.log(data);
              vue.pro_list = (data);

            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });
      },
      getRankList() {
        let vue = this;
        vue.ranks_list = config.productsRank;

      },
      getProFirst(){
        let vue = this;
        vue.pro_list = config.products;
      },

      /* 菜单分类加载 */
      getprolist(code, level_id) {
        let vue = this;
        let _url = apis.products;
        _url += '?code=' + code + '&level_id=' + level_id;
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
                console.log(data);
                vue.pro_list = (data);

              }else {
                console.log('no data')
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
    components: {
    }
  }
).$mount('#main');
