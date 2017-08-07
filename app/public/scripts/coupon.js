Vue.component('coupons',
  {
    template: '#coupon_item',
    data(){
      return {
        show_search: false,
        show_detail: false,
      }
    },
    props: ['couponitem'],
    mounted() {
      let vue= this;
    },
    methods:{
      showdetail(){
        let vue = this;
        if(vue.couponitem.goods.length > 0){
          vue.show_detail = !vue.show_detail;
        }
      },
      sub(id){
        /* 使用优惠券 */
        let vue = this;
        jAjax({
          type:'post',
          url:config.useUrl,
          data: {
            'id': id,
          },
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
            console.log('error');
          }
        });
      },
      receive(id){
        /* 领取优惠券 */
        let vue = this;
        jAjax({
          type:'post',
          url:config.getCouponUrl,
          data: {
            'id': id,
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                // vue.msg = data.message;
                // vue.showAlert = true;
                vue.$emit('pop',data.message, data.url);
                // if(data.url){
                //   vue.close_auto(vue.linkto, data.url);
                // }else {
                //   vue.close_auto();
                // }
              }else {
                vue.$emit('pop',data.message, data.url);
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });
      },
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
    // created: function () {
    //   let vue = this;
    //   vue.$on('pop', function (msg, url) {
    //     vue.pop(msg, url);
    //   })
    // },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      couponlist: config.couponlist,
      couponcount: config.couponcount,
      status: 0,
      tabs: ['未使用', '使用记录', '已过期'],
      tab_num: 0,
    },
    watch: {
    },
    methods: {
      pop(msg, url){
        let vue = this;
        vue.msg = msg;
        vue.showAlert = true;
        if(url){
          vue.close_auto(vue.linkto, url);
        }else {
          vue.close_auto();
        }
      },
      category(index){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        if(index == 0){
          vue.status = 0;
        }else if(index == 1){
          vue.status = 2;
        }else {
          vue.status = 3;
        }
        var _url = config.couponlistUrl + '?status=' + vue.status;
        jAjax({
          type:'get',
          url:_url,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.couponlist = data.data;
              }else {
                console.log('false')
              }
            }

          },
          error:function(){
            console.log('error');
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
).$mount('#coupon');
