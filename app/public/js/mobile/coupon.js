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
        if(vue.couponitem && vue.couponitem.goods.length > 0){
          vue.show_detail = !vue.show_detail;
        }
      },
      sub(id){
        /* 使用优惠券 */
        let vue = this,
          post_url = config.useUrl,
          post_data = {
            'id': id,
          };
        let _ref = 'subpost' + id;
        vue.$refs[_ref].post(post_url, post_data);
      },
      receive(id){
        /* 领取优惠券 */
        let vue = this,
        post_url = config.getCouponUrl,
          post_data = {
            'id': id,
          };
        let _ref = 'subpost' + id;
        vue.$refs[_ref].post(post_url, post_data);
      },
      succhandle(data){
        let vue = this;
        vue.$emit('succhandle',data);
      },
      postSuc(data){
        let vue = this;
        vue.$emit('postsuc',data);
      },
      postTip(data){
        let vue = this;
        vue.$emit('posttip',data);
      },
      postBefore(){
        let vue = this;
        vue.$emit('postbefore');
      },
      postError(){
        let vue = this;
        vue.$emit('posterror');
      },
    }
  }
);
let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    watch: {
      couponlist: function (val, oldVal) {
        if(!this.listloading){
          if(this.couponlist && this.couponlist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      couponlist: [],
      couponcount: config.couponcount,
      status: 0,
      tabs: ['未使用', '使用记录', '已过期'],
      tab_num: 0,

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false
    },
    methods: {
      initData(){
        let vue = this;
        vue.couponlist = config.couponlist;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
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
        vue.nodata = false;
        vue.tab_num = index;
        if(index == 0){
          vue.status = 0;
        }else if(index == 1){
          vue.status = 2;
        }else {
          vue.status = 3;
        }
        vue.couponlist = [];
        vue.nodata = false;
        var _url = config.couponlistUrl + '?status=' + vue.status;
        tools.ajaxGet(_url, vue.cateSucc, vue.getBefore);

      },
      cateSucc(data){
        let vue = this;
        vue.couponlist = data.data;
        vue.listloading = false;
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
).$mount('#coupon');
