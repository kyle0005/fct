let app = new Vue(
  {
    computed: {
      addressStr: function () {
        return this.address.province + this.address.cityId + this.address.townId + this.address.address;
      },
    },
    mounted: function() {
      let vue = this;
      vue.loadAddress();
      vue.loadCarts();
      vue.coupon = config.coupon;
      vue.loadCoupon();
      vue.calBuyPrice(vue.couponAmount);
    },
    data: {
      show_coup: false,
      coupPri: 0.08,
      carts: [],
      address: {},
      hasAddress: false,
      couponcode: '',
      hasCoupon: false,
      coupon: {},
      couponAmount: 0,
      totalPrice: 0
    },
    watch: {
    },
    methods: {
      showCoup(){
        let vue = this;
        vue.show_coup = !vue.show_coup
      },
      showPoint(){
        /* 计算积分 */
        let vue = this;

      },
      showAccountAmount (){
        /* 计算余额 */
        let vue = this;

      },
      loadAddress(){
        let vue = this;
        vue.address = config.address;
        if(vue.address.id !== undefined){
          vue.hasAddress = true;
        }else {
          vue.hasAddress = false;
        }
      },
      loadCarts(){
        let vue = this;
        vue.carts = config.carts;

      },
      loadCoupon(){
        let vue = this;
        if(vue.coupon.couponCode.length == 0){
          /* 优惠券为空 */
          vue.hasCoupon = false;
        }else {
          vue.hasCoupon = true;
          vue.couponAmount = vue.coupon.couponAmount;
        }
      },
      getCoupon(){
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
                vue.calBuyPrice(vue.couponAmount);
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
      calBuyPrice(coupon){
        let vue = this, price = 0;
        vue.carts.forEach((item) => {
          price += parseFloat(item.promotionPrice) * parseFloat(item.buyCount)
        });
        coupon = coupon || 0;
        vue.totalPrice = price - coupon;
        vue.totalPrice = vue.totalPrice.toFixed(2);
      },
      pay(){

      }
    },
  }
).$mount('#buy');
