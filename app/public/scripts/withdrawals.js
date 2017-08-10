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
      amount: null,
      withdrawals: config.withdrawals,
      max: config.withdrawals.withdrawAmount,
      min: 100,
      subText: '提交申请'
    },
    watch: {
      amount: function (val, oldVal) {
        let vue = this;
        if(vue.amount > vue.max || vue.amount < vue.min){
          vue.amount = oldVal;
        }
      },
    },
    methods: {
      sub(){
        let vue = this,
          post_url = config.withdrawalsUrl,
          post_data = {
            'amount': vue.amount
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
      }

    },
  }
).$mount('#withdrawals');
