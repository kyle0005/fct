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
      paginationType: {
        type: String,
        default: 'bullets'
      },
      spaceBetween: {
        type: Number,
        default: 10,
      }
    },
    data(){
      return {
        dom:''
      }
    },
    mounted() {
      var That = this;
      console.log(That.paginationType);
      let _def = That.paginationType === 'custom' ? null: function (swiper, index, className) {
        return '<span class="en-pagination ' + className + '"></span>';
      };
      this.dom = new Swiper('.' + That.swipeid, {
        //循环
        loop: That.loop,
        //分页器
        pagination: '.swiper-pagination',
        //分页类型
        // paginationType: That.paginationType, //fraction,progress,bullets
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
        lazyLoading: true,
        onTransitionStart: function (swiper) {
          That.$emit('slideindex',swiper.activeIndex);
        },
        paginationBulletRender: _def
      })
    },
    components: {
    }
  }
);
let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      let swipe_banner = this.$refs.banner;
      if (swipe_banner && swipe_banner.dom) {
        this.swipe_banner = swipe_banner.dom;
      }

      let swipe_presale = this.$refs.presale;
      if (swipe_presale && swipe_presale.dom) {
        this.swipe_presale = swipe_presale.dom;
      }

      vue.initData();
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false)
    },
    data: {
      showTop: false,
      isADShow: config.isADShow,

      swipe_banner: '',
      swipe_presale: '',
      banners: config.images,
      preSales: config.preSales

    },
    watch: {

    },
    methods: {
      initData(){
        let vue = this;

      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
      closegift(){
        let vue = this;
        vue.isADShow = false;
      }
    },
  }
).$mount('#entry');