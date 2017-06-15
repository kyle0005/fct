Vue.component('foot-top',
  {
    template: '#foot_top',
    computed: {
    },
    mounted: function() {

    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {
        open: false,
        docked: false,
        chosen: false,
        input_val: 1,
        specs: ['刻龙', '刻虎'],
        specs_num: 0,
        min: false
      }
    },
    methods: {
      buy(){
        location.href = "buy.html";
      },
      add(){
        let vue = this,
            num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(vue.min){
          vue.min = false;
        }
        num += 1;
        vue.input_val = num;
      },
      minus(){
        let vue = this,
            num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          vue.input_val = num;
        }
      },
      linkTo(index){
        let vue = this;
        this.specs_num = index;

      },
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
      },
      choose() {
        if (!this.open) {
          this.docked = true;
          this.open = true;
        } else {
          this.open = false;
          let vue = this;
          setTimeout(function() {
            vue.docked = false;
          }, 300);
        }
      },
      chooseSpec(){
        let vue = this;
        if(!vue.chosen) {
          vue.chosen = true;
        }
        else {
          vue.chosen = false;
        }
      }

    },
    components: {
    }
  }
);
