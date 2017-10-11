let app = new Vue(
  {
    mounted: function() {
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容

      subText: '申请发票',
      title: '',
      content: '工艺礼品',

      invoice: config.invoice
    },
    watch: {
    },
    methods: {
      sub(){
        let vue = this,
          post_url = config.invoiceUrl,
          post_data = {
            'title': vue.title,
            'content': vue.content,
          };
        vue.$refs.subpost.post(post_url, post_data);

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
    },
  }
).$mount('#invoice');
