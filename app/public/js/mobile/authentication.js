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
      name: '',
      uploadImg: {},
      // subText: '提交申请'
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
        if(file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg'){
          vue.msg = '文件格式不正确';
          vue.showAlert = true;
          vue.close_auto();
        }else {
          tools.imgCompress(file, vue.upload);
        }

      },
      upload(blob, filename){
        let vue = this;
        let formData = new FormData();
        formData.append('action', 'idcard');
        formData.append('file', blob, filename);
        console.log(blob)
        tools.ajaxPost(config.uploadFileUrl, formData, vue.postSuc, vue.postBefore, vue.postError, {}, vue.postTip, false);
      },
      postSuc(data){
        let vue = this;
        vue.uploadImg = data.data;
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
        let vue = this, data = {};
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
        data = {
          'IDcard': vue.IDcard,
          'bankAccount': vue.bankAccount,
          'bank': vue.bank,
          'name': vue.name,
          'avatar': vue.uploadImg.url
        };
        vue.$refs.subpost.post(config.authenticationUrl, data);
        /*jAjax({
          type:'post',
          url:config.authenticationUrl,
          data: {
            'IDcard': vue.IDcard,
            'bankAccount': vue.bankAccount,
            'bank': vue.bank,
            'name': vue.name,
            'avatar': vue.uploadImg.url
          },
          timeOut:5000,
          before:function(){
          },
          success:function(data){
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
        });*/
      },

      succhandle(data){
        let vue = this;
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
).$mount('#authentication');
