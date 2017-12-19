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
      // subText: '确认保存'
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
        tools.ajaxPost(config.uploadFileUrl, formData, vue.uploadSuc, vue.postBefore, vue.postError, {}, vue.postTip, false);
        /*jAjax({
          type:'post',
          url:config.uploadFileUrl,
          data: formData,
          // contentType: 'multipart/form-data',
          // enctype: 'multipart/form-data',
          contentType: false,   /!* false为上传文件 *!/
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
        });*/
      },
      uploadSuc(data){
        let vue = this;
        vue.uploadImg = data.data;
        vue.userinfo.headPortrait = vue.uploadImg.fullUrl;
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
      sub(){
        let vue = this,
          post_url = config.userinfoUrl,
          post_data = formData.serializeForm('userForm');
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
).$mount('#userinfo');
