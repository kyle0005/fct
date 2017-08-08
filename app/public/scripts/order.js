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
      postProcess: false
    },
    watch: {
    },
    methods: {
      finish(orderId){
        let vue = this;
        jAjax({
          type:'post',
          url:config.finish_url + '/' + orderId + '/finish',
          data: {},
          timeOut:5000,
          before:function(){
            vue.postProcess = true
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
            vue.postProcess = false

          },
          error:function(){
            vue.postProcess= false
          }
        });
      },
      cancel(orderId){
        let vue = this;
        jAjax({
          type:'post',
          url:config.cancel_url + '/' + orderId + '/cancel',
          data: {},
          timeOut:5000,
          before:function(){
            vue.postProcess = true
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
            vue.postProcess = false

          },
          error:function(){
            vue.postProcess = false
          }
        });
      },
      order_detail(){
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
