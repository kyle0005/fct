let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.loadChargeNum();
      vue.choose(vue.charge_nums[0][Object.keys(vue.charge_nums[0])[0]], Object.keys(vue.charge_nums[0])[0], 0);
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      charge: config.charge,
      charge_nums: [],
      tab_num: 0,

      isOther: false,
      charge_num: 0,
      gift: 0,
      balance: 0,

      discount: config.charge.defaultGift,
      hasNum:false,

      postProcess: false
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    },
    watch: {
      charge_num: function (val, oldVal) {
        let vue = this;
        if(!(vue.tab_num == vue.charge_nums.length - 1) && (vue.charge_num > vue.charge.max || vue.charge_num < vue.charge.min)){
          vue.charge_num = oldVal;
        }
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
      showText(item){
        let vue = this, flag = false;
        if(Object.keys(item)[0] == 0){
          flag = true;
        }
        return flag;
      },
      loadChargeNum(){
        let vue = this;
        let other = {
          0: vue.discount
        };
        for (let i in config.charge.rules){
          let item = {};
          if (config.charge.rules.hasOwnProperty(i)) {
            item[i] = config.charge.rules[i];
            vue.charge_nums.push(item);
          }
         }
        vue.charge_nums.push(other);
      },
      choose(discount, value, num){
        let vue = this;
        vue.tab_num = num;
        if(parseFloat(value) == 0){
          value = '';
          vue.isOther = true;
          vue.discount = config.charge.defaultGift;
        }else {
          vue.isOther = false;
          vue.discount = discount;
        }
        vue.charge_num = value;

      },
      sub(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.rechargeUrl,
          data: {
            'charge_num': vue.charge_num
          },
          timeOut:5000,
          before:function(){
            vue.postProcess = true;
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
            vue.postProcess = false;

          },
          error:function(){
            vue.postProcess = false;
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
