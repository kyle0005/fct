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

    },
    mounted: function() {
      let vue = this;
/*      let other = {
        0: vue.discount
      };
      vue.charge_nums.push(other);*/
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      charge: config.charge,
      charge_nums: config.charge.rules,

      isOther: false,
      charge_num: 0,
      gift: 0,
      balance: 0,

      discount: config.charge.defaultGift,
      hasNum:false
    },
    watch: {
      charge_num: function (val, oldVal) {
        let vue = this;
        if(vue.charge_num > 0){
          vue.hasNum = true;
        }else {
          vue.hasNum = false;
        }
        vue.gift = (parseFloat(vue.charge_num) * parseFloat(vue.discount)).toFixed(0);
        vue.balance = (parseFloat(vue.charge_num) + parseFloat(vue.gift)).toFixed(0);
      },
    },
    methods: {
      choose(discount, value){
        let vue = this;
        if(parseFloat(value) == 0){
          vue.isOther = true;
          vue.discount = config.charge.defaultGift;
        }else {
          vue.isOther = false;
          vue.discount = discount;
        }
        vue.charge_num = value;

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
).$mount('#recharge');
