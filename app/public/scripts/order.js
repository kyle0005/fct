let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      order_detail: config.order_detail,
      img_path: config.img_path,
      showConfirm: false, /* 显示confirm组件 */
      orderId: null,
      callback: null,

      delText: '删除订单',
      cancelText: '取消订单'
    },
    watch: {
    },
    methods: {
      finish(orderId){
        let vue = this,
          post_url = config.finish_url + '/' + orderId + '/finish',
          post_data = {};
        vue.$refs.subpost.post(post_url, post_data);
        /*jAjax({
          type:'post',
          url:config.finish_url + '/' + orderId + '/finish',
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
                if(data.url){
                  vue.close_auto(vue.linkto, data.url);
                }else {
                  vue.close_auto();
                }
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
      cancel(orderId){
        let vue = this,
          post_url = config.cancel_url + '/' + orderId + '/cancel',
          post_data = {};
        vue.$refs.cancelpost.post(post_url, post_data);;
        /*jAjax({
          type:'post',
          url:config.cancel_url + '/' + orderId + '/cancel',
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
                if(data.url){
                  vue.close_auto(vue.linkto, data.url);
                }else {
                  vue.close_auto();
                }
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
      order_detail(){
        let vue = this;

      },
      succhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
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
      },
      confirm(orderId, callback){
        let vue = this;
        vue.msg = '您确认要执行此操作？';
        vue.orderId = orderId;
        vue.callback = callback;
        vue.showConfirm = true;
      },
      no(){
        let vue = this;
        vue.showConfirm = false;
      },
      ok(callback, obj){
        let vue = this;
        vue.showConfirm = false;
        if(callback){
          callback(obj);
        }
      }
    },
  }
).$mount('#order');
