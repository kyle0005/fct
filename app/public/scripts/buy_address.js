let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
    },
    activated() {
    },
    deactivated() {
    },
    data: {
      show_coup: false,
      coupPri: 0.08
    },
    watch: {
    },
    methods: {
      showCoup(){
        let vue = this;
        if(vue.show_coup){
          vue.show_coup = false;
        }else {
          vue.show_coup = true;
        }

      }
    },
    components: {
    }
  }
).$mount('#buy_address');
