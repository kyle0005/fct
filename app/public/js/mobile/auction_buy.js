let app = new Vue(
  {
    computed: {
      addressStr: function () {
        return this.address.province + this.address.cityId + this.address.townId + this.address.address;
      },
    },
    mounted: function() {
      let vue = this;
      vue.product = config.product;
      vue.loadAddress();
      vue.calTotal();
      vue.calculateAmount(0);
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      product:{},
      address: {},
      hasAddress: false,
      remark: '',
      has_terms: config.has_terms,
      totalPrice: 0,
      points: config.points,  /* 积分 */
      usedPoint: 0,   /* 已使用积分 */
      usePoint: false,

      accountAmount: config.amount,     /* 余额 */
      usedAccountAmount: 0,   /* 已使用余额 */
      useAccountAmount: false,

      // payText: '我要付款'
    },
    watch: {
    },
    methods: {
      loadAddress(){
        let vue = this;
        vue.address = config.address;
        if(vue.address.id !== undefined){
          vue.hasAddress = true;
        }else {
          vue.hasAddress = false;
        }
      },
      calTotal(){
        let vue = this, price = 0;
        price = parseFloat(vue.product.bidPrice) - parseFloat(vue.product.deposit);
        vue.totalPrice = price.toFixed(2);
      },
      toFloat(num) {
        return parseFloat(num).toFixed(2);
      },

      pay(){
        let vue = this,
          post_url = config.pay_url,
          post_data = {};
        if(vue.has_terms){
          post_data = {
            'points': vue.usedPoint,
            'account_amount': vue.usedAccountAmount,
            'remark': vue.remark,
            'address_id': vue.address.id,
            'has_terms': vue.has_terms,
            'signup_id': config.signup_id
          };
          vue.$refs.paypost.post(post_url, post_data);

        }else {
          vue.msg = '请同意并钩选《方寸堂服务协议》';
          vue.showAlert = true;
          vue.close_auto();
        }

      },
      postSuc(data, item){
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

      calculateAmount(num){
        let vue= this;
        vue.calTotal();
        vue.points = config.points ;//用户当前积分
        vue.accountAmount = config.accountAmount;  //用户当前余额

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
        vue.calculateAmount(0);
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
).$mount('#buy');
