let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    watch: {
      address: function (val, oldVal) {
        if(!this.listloading){
          if(this.address && this.address.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data: {
      address: [],
      showAlert: false, //显示提示组件
      msg: null, //提示的内容

      listloading: true,
      nodata: false
    },
    methods: {
      initData(){
        let vue = this;
        vue.address = config.address;
        vue.listloading = false;
      },
      choose(item){
        let vue = this, _url = config.chooseAddrUrl + '?id=' + item.id,
          _data = {};
        tools.ajaxPost(_url, _data, vue.postSuc, vue.postBefore, vue.postError, {}, vue.postTip);
        /*jAjax({
          type:'post',
          url:config.chooseAddrUrl + '?id=' + item.id,
          data: {},
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                location.href = data.url;
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(status, statusText){
          }
        });*/
      },
      postSuc(data){
        let vue = this;

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

      addressStr(item){
        let vue = this;
        return item.province + item.cityId + item.townId + item.address;
      },
    },
  }
).$mount('#buy_address');
