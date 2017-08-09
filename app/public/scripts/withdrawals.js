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
        let vue = this;
        jAjax({
          type:'post',
          url:config.withdrawalsUrl,
          data: {
            'amount': vue.amount
          },
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            //{message:"xxx", url:"", code:200, data:""}
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

    },
  }
).$mount('#withdrawals');
