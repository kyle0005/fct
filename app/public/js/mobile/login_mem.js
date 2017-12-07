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
        subText: '登录'

      }
    },
    methods: {
      //发送登录信息
      mobileLogin(){
        let vue = this;
        if (!vue.phoneNumber) {
          vue.showAlert = true;
          vue.msg = '请输入手机号';
          vue.close_auto();
          return
        }else if(!vue.passWord){
          vue.showAlert = true;
          vue.msg = '请输入密码';
          vue.close_auto();
          return
        }
        //用户名登录
        vue.$refs.subpost.post(apis.userResource, formData.serializeForm('userLogin'));
      },
      mobileMsgLogin(){
        let vue = this, post_url = apis.userResource, post_data = formData.serializeForm('quickLogin');
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.msg = '手机号码不正确';
          vue.close_auto();
          return
        }
        //手机号登录
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
    }
  }
).$mount('#login');
