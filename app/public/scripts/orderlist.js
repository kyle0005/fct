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
      showStatus(){
        let vue = this;
        return '';

      },
    },
    mounted: function() {
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      show_search: false,
      orderlist: config.orderlist.entries,
      tabs: ["全部", "待付款", "待发货", "待收货", "待评价"],
      tab_num: 0,
    },
    watch: {
    },
    methods: {
      category(index){
        let vue = this, _status = 0;
        vue.tab_num = index;
        if(index == 0){
          _status = "";
        }else {
          _status = index - 1;
        }
        var _url = config.orderlist_url + '?status=' + _status;
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
                vue.orderlist = data.data.entries;
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
      subSearch(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.coupon_url,
          data: {
            'validateCoupon': config.validateCoupon,
            'couponCode': vue.couponcode,
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            //{message:"xxx", url:"", code:200, data:""}
            if(data){
              data = JSON.parse(data);
              vue.showCoup();
              if(parseInt(data.code) == 200){
                vue.coupon.couponAmount = data.data;
                vue.coupon.couponCode = vue.couponcode;
                vue.loadCoupon();
                vue.calculateAmount(0);
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
      search(num){
        let vue = this;
        switch(parseInt(num))
        {
          case 0:
            vue.show_search = !vue.show_search;
            break;
          case 1:
            vue.show_search_d = !vue.show_search_d;
            break;
        }

      },
    },
  }
).$mount('#orderlist');
