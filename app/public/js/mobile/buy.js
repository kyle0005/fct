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
      useAccountAmount: false,

      // coupText: '使用',
      // payText: '我要付款'
    },
    watch: {
    },
    methods: {
      showCoup(){
        let vue = this;
        vue.show_coup = !vue.show_coup
      },
      loadAddress(){
        let vue = this;
        vue.address = config.address;
        if(vue.address && vue.address.id > 0){
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
        let vue = this,
          post_url = config.coupon_url,
          post_data = {
          'validateCoupon': config.validateCoupon,
          'couponCode': vue.couponcode,
        };
        vue.$refs.usecoup.post(post_url, post_data);

        /*jAjax({
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
              if(parseInt(data.code) == 200){
                vue.showCoup();
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
        });*/
      },
      calTotal(){
        let vue = this, price = 0;
        vue.carts.forEach((item) => {
          price += parseFloat(item.promotionPrice) * parseFloat(item.buyCount)
        });
        vue.totalPrice = price.toFixed(2);
      },
      pay(){
        let vue = this, cart_list = [], _temp = '',
          post_url = config.pay_url,
          post_data = {};
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
          post_data = {
            'points': vue.usedPoint,
            'accountAmount': vue.usedAccountAmount,
            'couponCode': _temp,
            'remark': vue.remark,
            'addressId': vue.address?vue.address.id:0,
            'orderGoodsInfo': JSON.stringify(cart_list),
            'has_terms': vue.has_terms
          };

          let _num = Math.round(Math.random() * 3000);
          let paras = {
            'delaynum': _num
          };
         vue.$refs.paypost.post(post_url, post_data, paras);

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


      },
      toFloat(num) {
        return num.toFixed(2);
      },
      payhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
      },
      succhandle(data){
        let vue = this;
        vue.showCoup();
        vue.coupon.couponAmount = data.data;
        vue.coupon.couponCode = vue.couponcode;
        vue.loadCoupon();
        vue.calculateAmount(0);
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
).$mount('#buy');
