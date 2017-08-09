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
      subText: '删除',
      del_index: null
    },
    methods: {
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
          },
          error:function(status, statusText){
          }
        });
      },
      edit(item){
        let vue = this;
        location.href = config.editUrl + '?id=' + item.id;
      },
      del(obj){
        let vue = this,
          post_url = config.delAddrUrl + '?id=' + obj.item.id,
          post_data = {};
        vue.del_index = obj.index;
        let _ref = 'subpost' + obj.index;
        vue.$refs[_ref][0].post(post_url, post_data);

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
      },

      succhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.address.splice(vue.del_index, 1);
        vue.setDefault(vue.address[0]);
        vue.defaultAddr();
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
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
      }
    },
  }
).$mount('#buy_address');
