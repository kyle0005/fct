var app = new Vue(
  {
    computed: {
      //判断手机号码
      rightPhoneNumber: function (){
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    data() {
      return {
        inviteCode: null,
        shopName: '',
        description: '',
        userInfo: null,
        userAccount: null,
        passWord: null,
        showAlert: false,
        msg: null,

        action: 'login',
        // subText: '我要申请'

      }
    },
    methods: {
      //发送登录信息
      mobileLogin(){
        let vue = this;
        if (!vue.inviteCode) {
          vue.showAlert = true;
          vue.msg = '请输入邀请码';
          vue.close_auto();
          return
        }else if(!vue.shopName){
          vue.showAlert = true;
          vue.msg = '请输入店铺名';
          vue.close_auto();
          return
        }
        else if(!vue.description){
          vue.showAlert = true;
          vue.msg = '请输入申请说明';
          vue.close_auto();
          return
        }
        let post_data = {
          'code': vue.inviteCode,
          'name': vue.shopName,
          'remark': vue.description
        };
        //用户名登录
        vue.$refs.subpost.post(config.storeUrl, post_data);
      },
      postSuc(data){
        let vue = this;
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
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
      }
    }
  }
).$mount('#login');
