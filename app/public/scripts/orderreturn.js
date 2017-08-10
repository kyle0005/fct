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
      servicetype: 0,
      reason: '',
      subText: '提交申请'
    },
    watch: {
    },
    methods: {
      delImg(index){
        let vue = this;
        vue.uploadItem.splice(index, 1);
        vue.subUpload.splice(index, 1);
      },
      fileChange(event){
        let vue = this, file = {};
        if (typeof event.target === 'undefined') {
          file = event[0];
        }
        else {
          file = event.target.files[0];
        }
        var form_data = new FormData();
        form_data.append('action', 'head');
        form_data.append('file', file);

        jAjax({
          type:'post',
          url:config.uploadFileUrl,
          data: form_data,
          // contentType: 'multipart/form-data',
          // enctype: 'multipart/form-data',
          contentType: false,
          timeOut:60000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.uploadItem.push(data.data.fullUrl);
                vue.subUpload.push(data.data.url);
              }
            }
          },
          error:function(){
          }
        });
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
