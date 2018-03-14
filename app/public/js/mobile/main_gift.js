let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
    },
    data: {
      nodata: false,
      isLogin: config.isLogin,
      showPop: false
    },
    watch: {},
    methods: {
      initData(){
        let vue = this;

      },
      share(){
        let vue = this;
        vue.showPop = true;
      }

    },
  }
).$mount('#gift');
