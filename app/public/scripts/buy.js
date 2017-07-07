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
      vue.calTotal();
      vue.calBuyPrice(vue.couponAmount);
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      show_coup: false,
      coupPri: 0.08,
      carts: [],
      address: {},
      hasAddress: false,
      remark: '',
      has_terms: config.has_terms,
      couponcode: '',
      hasCoupon: false,
      coupon: {},
      couponAmount: 0,
      totalPrice: 0,
      points: config.points,  /* 积分 */
      usedPoint: 0,   /* 已使用积分 */
      usePoint: false,

      accountAmount: config.accountAmount,     /* 余额 */
      usedAccountAmount: 0,   /* 已使用余额 */
      useAccountAmount: false
    },
    watch: {
    },
    methods: {
      agree(){
        let vue = this;
        vue.has_terms = !vue.has_terms;
      },
      showCoup(){
        let vue = this;
        vue.show_coup = !vue.show_coup
      },
      showPoint(){
        /* 计算积分 */
        let vue = this, _rate = 0.01;
        vue.usePoint = !vue.usePoint;
        /* 计算使用过的积分值 */
        if(vue.totalPrice > parseFloat(vue.points * _rate)){
          vue.usedPoint = vue.points;
        }else{
          vue.usedPoint = vue.totalPrice / _rate;
        }

        if(vue.usePoint){
          vue.calBuyPrice(0, parseFloat(vue.points * _rate), 0);
        }else {
          vue.calBuyPrice(0, -parseFloat(vue.points * _rate), 0);
        }

      },
      showAccountAmount (){
        /* 计算余额 */
        let vue = this;
        vue.useAccountAmount = !vue.useAccountAmount;
        /* 计算使用过的余额值 */
        if(vue.totalPrice > parseFloat(vue.accountAmount)){
          vue.usedAccountAmount = vue.accountAmount;
        }else{
          vue.usedAccountAmount = vue.totalPrice;
        }

        if(vue.useAccountAmount){
          vue.calBuyPrice(0, 0, parseFloat(vue.accountAmount));
        }else {
          vue.calBuyPrice(0, 0, -parseFloat(vue.accountAmount));
        }
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
      calTotal(){
        let vue = this, price = 0;
        vue.carts.forEach((item) => {
          price += parseFloat(item.promotionPrice) * parseFloat(item.buyCount)
        });
        vue.totalPrice = price.toFixed(2);
      },
      calBuyPrice(coupon, point, accountAmount){
        let vue = this;
        coupon = coupon || 0;
        point = point || 0;
        accountAmount = accountAmount || 0;
        vue.totalPrice -= (coupon + point + accountAmount);
        vue.totalPrice = vue.totalPrice.toFixed(2);
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
      pay(){
        let vue = this;
        if(vue.has_terms){
          jAjax({
            type:'post',
            url:config.pay_url,
            data: {
              'points': vue.usedPoint,
              'accountAmount': vue.usedAccountAmount,
              'couponCode': vue.coupon.couponCode,
              'remark': vue.remark,
              'addressId': vue.address.id,
              'orderGoodsInfo': base64.encode64(JSON.stringify(vue.carts)),
              'has_terms': vue.has_terms
            },
            // data: formData.serializeForm('buyOrder'),
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
        }else {
          vue.msg = '请同意并钩选《方寸堂服务协议》';
          vue.showAlert = true;
          vue.close_auto();
        }

      }
    },
  }
).$mount('#buy');
