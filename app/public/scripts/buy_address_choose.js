let app = new Vue(
  {
    mounted: function() {
      let vue = this;
    },
    data: {
      address: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
    },
    methods: {
      choose(item){
        let vue = this;
        jAjax({
          type:'post',
          url:config.chooseAddrUrl + '?id=' + item.id,
          data: {},
          timeOut:5000,
          before:function(){
            console.log('before');
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
            console.log(statusText);
          }
        });
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
