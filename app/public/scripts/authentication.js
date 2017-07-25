Vue.component('pop',
  {
    template: '#pop',
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg'],
    methods: {
      close(){
        this.$emit('close')
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
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      bankList: config.bankList,
      IDcard: '',
      bankAccount: '',
      bank: '',
      name: ''
    },
    watch: {
    },
    methods: {
      sub(){
        let vue = this;
        if(!vue.name){
          vue.msg = '请输入真实姓名';
          vue.showAlert = true;
          vue.close_auto();
          return false;
        }
        if(!vue.bank){
          vue.msg = '请选择开户行';
          vue.showAlert = true;
          vue.close_auto();
          return false;
        }
        if(!vue.bankAccount){
          vue.msg = '请输入开户行账号';
          vue.showAlert = true;
          vue.close_auto();
          return false;
        }
        if(!vue.IDcard){
          vue.msg = '请输入身份证号码';
          vue.showAlert = true;
          vue.close_auto();
          return false;
        }

        jAjax({
          type:'post',
          url:config.authenticationUrl,
          data: {
            'IDcard': vue.IDcard,
            'bankAccount': vue.bankAccount,
            'bank': vue.bank,
            'name': vue.name
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.showCoup();
              if(parseInt(data.code) == 200){
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
            console.log('error');
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
).$mount('#authentication');
