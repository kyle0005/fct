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
      tabs: ['宝贝', '守艺人'],
      tab_num: 0,
      collection: [],
      fromType: 0,

      listloading: true,
      pagerloading: false,
      isPage: false,
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
        vue.fromType = config.fromType;
      },

      del(item, index){
        let vue = this, _url = config.collectionDel + '?from_type=' + item.favType + '&from_id=' + item.id,
        _data = {
          'keyword': vue.keywords
        };
        tools.ajaxPost(_url, _data, vue.postSuc, vue.postBefore, vue.postError, index, vue.postTip);
        /*jAjax({
          type:'post',
          url:config.collectionDel + '?from_type=' + item.favType + '&from_id=' + item.id,
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
        });*/
      },
      postSuc(data, index){
        let vue = this;
        vue.collection.splice(index, 1);
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },

      getBefore(){
        let vue = this;
        vue.listloading = true;
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
