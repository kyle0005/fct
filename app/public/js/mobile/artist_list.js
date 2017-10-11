Vue.component('m-swipe',
  {
    template: '#m_swipe',
    props: {
      swipeid: {
        type: String,
        default: ''
      },
      effect: {
        type: String,
        default: 'slide'
      },
      loop: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: 'horizontal'
      },
      pagination: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Number,
        default: 5000,
      },
      centeredSlides: {
        type: Boolean,
        default: true,
      },
      slidesPerView:{
        type: String,
        default: 'auto'
      },
      paginationType: {
        type: String,
        default: 'bullets'
      }
    },
    data(){
      return {
        dom:''
      }
    },
    mounted() {
      var That = this;
      this.dom = new Swiper('.' + That.swipeid, {
        //循环
        loop: That.loop,
        //分页器
        pagination: '.swiper-pagination',
        //分页类型
        paginationType: That.paginationType, //fraction,progress,bullets
        //自动播放
        autoplay: That.autoplay,
        //方向
        direction: That.direction,
        //特效
        effect: That.effect, //slide,fade,coverflow,cube
        autoplayDisableOnInteraction: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        height : window.innerHeight,
        lazyLoading: false,
        centeredSlides: That.centeredSlides,
        slidesPerView: That.slidesPerView,
        coverflow: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : false
        },
        onTransitionStart: function (swiper) {
          def_target.fireEvent({
            type: 'slide'
          });

/*          window.addEventListener('slide',function () {
            console.log('aaa')
          },false);*/
        }
      });
    },
  }
);
let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.load();
      let swiper = this.$refs.swiper;
      if (swiper.dom) {
        this.swiper = swiper.dom;
      }

    },
    activated() {
      if (this.swiper) {
        this.swiper.startAutoplay();
      }
    },
    deactivated() {
      this.loop = false;
      if (this.swiper) {
        this.swiper.stopAutoplay();
      }
    },
    data: {
      artist: [],
      listloading: true,
      nodata: false
    },
    watch: {
      artist: function (val, oldVal) {
        if(!this.listloading){
          if(this.artist && this.artist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      load(){
        let vue = this;
        vue.artist = config.artist;
        vue.listloading = false;
      }
    },
    components: {

    }
  }
).$mount('#artist_list');
