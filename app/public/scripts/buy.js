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
      vue.calculateAmount(0);
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      show_coup: false,
      coupPri: null,
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
      showCoup(){
        let vue = this;
        vue.show_coup = !vue.show_coup
      },
      // showPoint(){
      //   /* 计算积分 */
      //   let vue = this, _rate = 0.01;
      //   vue.usePoint = !vue.usePoint;
      //   /* 计算使用过的积分值 */
      //   if(vue.totalPrice > parseFloat(vue.points * _rate)){
      //     vue.usedPoint = vue.points;
      //   }else{
      //     vue.usedPoint = vue.totalPrice / _rate;
      //   }
      //
      //   if(vue.usePoint){
      //     vue.calBuyPrice(0, parseFloat(vue.points * _rate), 0);
      //   }else {
      //     vue.calBuyPrice(0, -parseFloat(vue.points * _rate), 0);
      //   }
      //
      // },
      // showAccountAmount (){
      //   /* 计算余额 */
      //   let vue = this;
      //   vue.useAccountAmount = !vue.useAccountAmount;
      //   /* 计算使用过的余额值 */
      //   if(vue.totalPrice > parseFloat(vue.accountAmount)){
      //     vue.usedAccountAmount = vue.accountAmount;
      //   }else{
      //     vue.usedAccountAmount = vue.totalPrice;
      //   }
      //
      //   if(vue.useAccountAmount){
      //     vue.calBuyPrice(0, 0, parseFloat(vue.accountAmount));
      //   }else {
      //     vue.calBuyPrice(0, 0, -parseFloat(vue.accountAmount));
      //   }
      // },
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
        if(!vue.coupon || !vue.coupon.couponCode){
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
      calTotal(){
        let vue = this, price = 0;
        vue.carts.forEach((item) => {
          price += parseFloat(item.promotionPrice) * parseFloat(item.buyCount)
        });
        vue.totalPrice = price.toFixed(2);
      },
      // calBuyPrice(coupon){
      //   let vue = this;
      //   coupon = coupon || 0;
      //   vue.totalPrice -= (coupon);
      //   vue.totalPrice = vue.totalPrice.toFixed(2);
      // },
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
        let vue = this, cart_list = [], _temp = '';
        vue.carts.forEach((item) => {
          let _item = {};
          _item.goodsId = item.goodsId;
          _item.specId = item.goodsSpecId;
          _item.buyCount = item.buyCount;
          cart_list.push(_item);
        });
        if(!vue.coupon || !vue.coupon.couponCode){}
        else {
          _temp = vue.coupon.couponCode;
        }
        if(vue.has_terms){
          jAjax({
            type:'post',
            url:config.pay_url,
            data: {
              'points': vue.usedPoint,
              'accountAmount': vue.usedAccountAmount,
              'couponCode': _temp,
              'remark': vue.remark,
              'addressId': vue.address.id,
              'orderGoodsInfo': base64.encode64(JSON.stringify(cart_list)),
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

      },
      calculateAmount(num){
        let vue= this;
        vue.calTotal();
          // vue.totalPrice= "10000.00"; //应付金额
          // vue.couponAmount = 100.00; //优惠券面额
          vue.totalPrice = vue.totalPrice - vue.couponAmount; //应付金额
          vue.points = config.points ;//用户当前积分
          vue.accountAmount = config.accountAmount;  //用户当前余额

          // vue.usePoint = false; //是否使用积分
          // vue.useAccountAmount = false; //是否使用余额支付
        if(num == 1){
          vue.usePoint = !vue.usePoint;
        }else if(num == 2){
          vue.useAccountAmount = !vue.useAccountAmount;
        }

          vue.usedPoint = 0;//最终使用积分
          vue.usedAccountAmount = 0;//最终使用余额
          if(vue.points>0 && vue.usePoint){
            //如果当用可用积分大于应付金额
            if(vue.points/100 > vue.totalPrice){
              vue.usedPoint = vue.totalPrice*100;
              vue.totalPrice = 0;
            }else{
              vue.totalPrice = vue.totalPrice - vue.points/100;
              vue.usedPoint = vue.points; //积分全部扣掉
            }
          }
          if(vue.totalPrice>0 && vue.accountAmount>0 && vue.useAccountAmount){
            //当余额可抵扣支付金额时
            if(vue.accountAmount>vue.totalPrice){
              vue.usedAccountAmount = vue.totalPrice; //
              vue.totalPrice = 0;
            }else{
              vue.totalPrice = vue.totalPrice - vue.accountAmount;
              vue.usedAccountAmount = vue.accountAmount;
            }
          }


      }
    },
  }
).$mount('#buy');
