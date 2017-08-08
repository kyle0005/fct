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
      sex: config.userinfo.sex,
      date: config.userinfo.birthday,
      postProcess: false
    },
    watch: {
    },
    methods: {
      fileChange(event){
        let vue = this, file = {};
        if (typeof event.target === 'undefined') {
          file = event[0];
        }
        else {
          file = event.target.files[0];
        }
        var formData = new FormData();
         formData.append('action', 'head');
        formData.append('file', file);

      /*  var xhr = new XMLHttpRequest();
        xhr.open('post',config.uploadFileUrl);
        xhr.send(formData);*/
        jAjax({
          type:'post',
          url:config.uploadFileUrl,
          data: formData,
          // contentType: 'multipart/form-data',
          // enctype: 'multipart/form-data',
          contentType: false,   /* false为上传文件 */
          timeOut:60000,
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
               vue.uploadImg = data.data;
               vue.userinfo.headPortrait = vue.uploadImg.fullUrl;
               console.log(vue.uploadImg)
              }
            }
          }
        });
      },
      sub(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.userinfoUrl,
          data: formData.serializeForm('userForm'),
          timeOut:5000,
          before:function(){
            vue.postProcess = true
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
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
            vue.postProcess = false

          },
          error:function(status, statusText){
            vue.postProcess = false
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
