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

    },
    data: {
      show_coup: false,
      coupPri: 0.08,
      carts: [],
      address: {},
      hasAddress: false
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
        if(vue.address.id !== undefined){
          vue.hasAddress = true;
        }else {
          vue.hasAddress = false;
        }
      },
      loadCarts(){
        let vue = this;
        vue.carts = config.carts;

      }
    },
  }
).$mount('#buy');
