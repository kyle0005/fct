Vue.component('pop',
  {
    template: '#pop',
    computed: {
    },
    mounted: function() {
    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
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
var app = new Vue(
  {
    computed: {
      //判断手机号码
      rightPhoneNumber: function (){
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    mounted: function() {

    },
    created(){
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {
        phoneNumber: 12345678900, //电话号码
        mobileCode: 123456, //短信验证码
        validate_token: null, //获取短信时返回的验证值，登录时需要
        computedTime: 0, //倒数记时
        userInfo: null, //获取到的用户信息
        userAccount: null, //用户名
        passWord: null, //密码
        captchaCodeImg: null, //验证码地址
        codeNumber: null, //验证码
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
      }
    },
    watch: {
    },
    methods: {
      //获取短信验证码
      getVerifyCode(){
        let vue = this;
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          this.timer = setInterval(() => {
            this.computedTime --;
            if (this.computedTime == 0) {
              clearInterval(this.timer)
            }
          }, 1000)
          //发送短信验证码
          jAjax({
            type:'post',
            url:apis.mobileCodeResource,
            data: this.phoneNumber,
            timeOut:5000,
            before:function(){
              console.log('before');
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                vue.msg = data.code;
                vue.showAlert = true;
              }else {
                vue.showAlert = true;
                vue.msg = '';
              }

            },
            error:function(status, statusText){
              vue.msg = status;
              vue.showAlert = true;
              vue.msg = status;
            }
          });


        }
      },
      //发送登录信息
      mobileLogin(){
        let vue = this;
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.msg = '手机号码不正确';
          return
        }else if(!(/^\d{6}$/gi.test(this.mobileCode))){
          this.showAlert = true;
          this.msg = '短信验证码不正确';
          return
        }
        //手机号登录
        jAjax({
          type:'post',
          url:apis.userResource,
          // contentType: "application/json",
          data: formData.serializeForm('quick_login'),
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.msg = data;
              vue.showAlert = true;
               location.href = 'main.html';
            }else {
              vue.showAlert = true;
              vue.msg = data;
            }

          },
          error:function(status, statusText){
            console.log(statusText);
          }
        });


      },
      close(){
        this.showAlert = false;
      }
    },
    components: {
    }
  }
).$mount('#quicklogin');
