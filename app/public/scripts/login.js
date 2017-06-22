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
        phoneNumber: null, //电话号码
        userInfo: null, //获取到的用户信息
        userAccount: null, //用户名
        passWord: null, //密码
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
      }
    },
    watch: {
    },
    methods: {
      //发送登录信息
      mobileLogin(){
        let vue = this;
        if (!vue.phoneNumber) {
          vue.showAlert = true;
          vue.msg = '请输入手机号';
          return
        }else if(!vue.passWord){
          vue.showAlert = true;
          vue.msg = '请输入密码';
          return
        }
        console.log(formData.serializeForm('userLogin'))
        //用户名登录
        jAjax({
          type:'post',
          url:apis.userResource,
          // contentType: "application/json",
          data: formData.serializeForm('userLogin'),
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){

              data = JSON.parse(data);
              vue.msg = data;
              vue.showAlert = true;
              // location.href = 'login.html';
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
).$mount('#login');
