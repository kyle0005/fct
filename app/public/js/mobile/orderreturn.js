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
      product: config.product,
      description: '',
      uploadItem: [],
      subUpload: [],
      maxNum: 3,
      servicetype: 1,
      reason: '',
      // subText: '提交申请'
    },
    watch: {
    },
    methods: {
      delImg(index){
        let vue = this;
        vue.uploadItem.splice(index, 1);
        vue.subUpload.splice(index, 1);
      },
      postSuc(data){
        let vue = this;

      },
      uploadSuc(data){
        let vue = this;
        vue.uploadItem.push(data.data.fullUrl);
        vue.subUpload.push(data.data.url);
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
        formData.append('action', 'head');
        formData.append('file', blob, filename);
        tools.ajaxPost(config.uploadFileUrl, formData, vue.uploadSuc, vue.postBefore, vue.postError, {}, vue.postTip, false);
      },
      sub(){
        let vue = this,
          post_url = config.returnUrl,
          post_data = {
            'order_id': vue.product.orderId,
            'order_product_id': vue.product.id,
            'service_type': vue.servicetype,
            'reason': vue.reason,
            'description': vue.description,
            'images': JSON.stringify(vue.subUpload)
          };
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
).$mount('#orderreturn');
