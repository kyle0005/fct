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
      userinfo: config.userinfo,
      uploadImg: {},
      file: {},
    },
    watch: {
    },
    methods: {
      fileChange(event){
        let vue = this;
        if (typeof event.target === 'undefined') {
          vue.file = event[0];
        }
        else {
          vue.file = event.target.files[0];
        }
        var formData = new FormData();
        formData.append("file", vue.file);
        jAjax({
          type:'post',
          url:config.uploadFileUrl,
          data: formData,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
               vue.uploadImg = data.data;
               vue.userinfo.headPortrait = vue.uploadImg.fullUrl;
               console.log(vue.uploadImg)
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });
      },
      sub(){
        jAjax({
          type:'post',
          url:apis.userResource,
          data: formData.serializeForm('userLogin'),
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto(vue.linkto, data.url);

              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(status, statusText){
            console.log(statusText);
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
).$mount('#userinfo');
