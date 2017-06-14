/**
 * Created by 阿万银 on 2017/6/11.
 */
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
      }
    },
    methods: {
      toIndex(){
      },
      toLogin(){
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

    },
    components: {
    }
  }
);
