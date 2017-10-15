let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      status: 0,
      tabs: ['宝贝', '合作艺人'],
      tab_num: 0,
      collection: [],

      listloading: true,
      nodata: false
    },
    watch: {
      collection: function (val, oldVal) {
        if(!this.listloading){
          if(this.collection && this.collection.length > 0){
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
        vue.collection = config.collection;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      del(item, index){
        let vue = this;
        jAjax({
          type:'post',
          url:config.collectionDel + '?from_type=' + item.favType + '&from_id=' + item.favoriteId,
          data: {
            'keyword': vue.keywords
          },
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.collection.splice(index, 1);
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
          }
        });
      },
      category(index){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        vue.collection = [];
        vue.nodata = false;
        var _url = config.collectionUrl + '?from_type=' + index;
        tools.ajaxGet(_url, vue.cateSucc, vue.getBefore);

      },
      cateSucc(data){
        let vue = this;
        vue.collection = data.data;
        vue.listloading = false;
      },
      close(){
        this.showAlert = false;
      },
      close_auto(callback, obj){
        let vue = this;
        setTimeout(function () {
          vue.showAlert = false;
          if(callback){
            callback(obj);
          }

        }, 1500);

      },
      linkto(url){
        if(url){
          location.href = url;
        }
      },

    },
  }
).$mount('#collection');