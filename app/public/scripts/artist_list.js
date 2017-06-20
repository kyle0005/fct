let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.load();
    },
    activated() {
    },
    deactivated() {
    },
    data: {
    },
    watch: {
    },
    methods: {
      load(){
        var swiper = new Swiper('.swiper-container', {
          effect: 'coverflow',
          centeredSlides: true,
          slidesPerView: 'auto',
          loop: true,
          coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : false
          }
        });
      }
    },
    components: {

    }
  }
).$mount('#artist_list');
