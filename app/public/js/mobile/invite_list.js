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
        //自动播放
        autoplay: That.autoplay,
        speed: 400,
        oSwiping : true,
        //方向
        direction: That.direction,
        //特效
        effect: That.effect, //slide,fade,coverflow,cube
        fade: {
          crossFade: true,
        },
        autoplayDisableOnInteraction: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        height : window.innerHeight,
        lazyLoading: true,
        onTransitionStart: function (swiper) {

        },

      })
    },
    components: {
    }
  }
);

let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      let swipe_banner = this.$refs.banner;
      if (swipe_banner && swipe_banner.dom) {
        this.swipe_banner = swipe_banner.dom;
      }
    },
    data: {
      tips: config.tips,
      invitelist: config.invitelist,
      isLogin: config.isLogin,
      swipe_banner: '',
      showAlert: false, //显示提示组件
      msg: config.msg, //提示的内容

      showPop: false
    },
    methods: {
      share(){
        let vue = this;
        vue.showPop = true;
      },
      pop(){
        let vue = this;
        vue.showAlert = true;
        vue.close_auto();
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
).$mount('#invitelist');
