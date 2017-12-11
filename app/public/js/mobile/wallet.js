let confirm_html = '<div class="confirm-container pay">' +
  '<section class="inner">' +
  '<div class="confirm-text"><div class="title">交纳保证金</div>{{ msg }}</div>' +
  '<div class="confirm-btn">' +
  '<a href="javascript:;" class="cancel" @click="no()">取消</a>' +
  '<a href="javascript:;" class="ok" @click="ok()">前往支付</a>' +
  '</div></section></div>';
Vue.component('confirm',
  {
    template: confirm_html,
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg', 'callback', 'obj'],
    methods: {
      no(){
        this.$emit('no');
      },
      ok(){
        this.$emit('ok', this.callback, this.obj);
      }
    }
  }
);
let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    data: {
      msg: null, //提示的内容
      callback: null,
      showConfirm: false, /* 显示confirm组件 */
    },
    methods: {
      comf(){
        let vue = this;
        vue.confirm(vue.link);
      },
      link(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.rechange_url,
          data: {
            'can_withdraw': 1,
            'pay_amount': 2000
          },
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
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
      confirm(callback){
        let vue = this;
        vue.callback = callback;
        vue.msg = '您确认交纳拍卖保证金2000元？';
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
    }
  }
).$mount('#wallet');
