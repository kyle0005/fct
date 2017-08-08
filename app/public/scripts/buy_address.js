let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.defaultAddr();
    },
    data: {
      address: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      picked: '',
      postProcess: false
    },
    methods: {
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
      setDefault(item){
        let vue = this;
        vue.address.forEach((item, index) => {
          item.isDefault = 0;
        });
        item.isDefault = 1;
      },
      changeDefault(item){
        let vue = this;
        jAjax({
          type:'post',
          url:config.defaultAddrUrl + '?id=' + item.id,
          data: {},
          timeOut:5000,
          before:function(){
            vue.postProcess = true;
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
                vue.setDefault(item);
                vue.defaultAddr();
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }
            vue.postProcess = false;
          },
          error:function(status, statusText){
            vue.postProcess = false;
          }
        });
      },
      edit(item){
        let vue = this;
        location.href = config.editUrl + '?id=' + item.id;
      },
      del(item, index){
        let vue = this;
        jAjax({
          type:'post',
          url:config.delAddrUrl + '?id=' + item.id,
          data: {},
          timeOut:5000,
          before:function(){
            vue.postProcess = true;
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
                vue.address.splice(index, 1);
                vue.setDefault(vue.address[0]);
                vue.defaultAddr();
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }
            vue.postProcess = false;

          },
          error:function(status, statusText){
            vue.postProcess = false;
          }
        });
      },
      addressStr(item){
        let vue = this;
        return item.province + item.cityId + item.townId + item.address;
      },
      defaultAddr(){
        let vue = this,
          _def = 0,
          _str = '';
        vue.address.forEach((item) => {
          _def = parseInt(item.isDefault);
          if(_def == 1){
            _str = vue.addressStr(item);
          }
        });
        vue.picked = _str;
      }
    },
  }
).$mount('#buy_address');
