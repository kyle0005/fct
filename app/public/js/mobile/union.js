let app = new Vue(
  {
    mounted: function () {
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      union: config.union,
      inviteCodes: config.union.inviteCodes
    },
    computed: {
      reversedNum: function () {
        return parseFloat(this.union.deposit) / 10000;
      },
      reversedRatio: function () {
        return parseFloat(this.union.kpiRebateRatio) * 100;
      },
    },
    watch: {

    },
    methods: {
      invite(){
        let vue = this, _url = config.add_url;
        tools.ajaxPost(_url, {}, vue.postSuc, vue.postBefore, vue.postError, {}, vue.postTip);
      },
      postSuc(data, index){
        let vue = this, _data = vue.inviteCodes;
        vue.inviteCodes = [];
        vue.inviteCodes = _data.splice(0, 0, data.data);
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
      close_auto(callback, obj){
        let vue = this;
        setTimeout(function () {
          vue.showAlert = false;
          if(callback){
            callback(obj);
          }
        }, 1500);

      },
    },
  }
).$mount('#union');
