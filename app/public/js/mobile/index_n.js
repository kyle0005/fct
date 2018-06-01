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
      var That = this, _page = '.swiper-pagination';
      console.log(That.paginationType);
      let _def = That.paginationType === 'custom' ? null: function (swiper, index, className) {
        return '<span class="en-pagination ' + className + '"></span>';
      };
      if(That.pagination === false){
        _page = false;
      }
      this.dom = new Swiper('.' + That.swipeid, {
        //循环
        loop: That.loop,
        //分页器
        pagination: _page,
        // pagination: That.pagination || '.swiper-pagination',
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
let _time_html = '<span :endTime="endTime" :callback="callback" >'+
  '<slot><span class="time-block">{{ time_content.hour }}</span>:<span class="time-block">{{ time_content.min }}</span>:<span class="time-block">{{ time_content.sec }}</span></slot>' +
  '</span>';
Vue.component('m-time',
  {
    template: _time_html,
    data(){
      return {
        time_content: {
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        },
      }
    },
    props:{
      endTime:{
        type: Number,
        default :0
      },
      callback : {
        type : Function,
        default :''
      }
    },
    mounted () {
      this.countdowm(this.endTime)
    },
    methods: {
      countdowm(timestamp){
        let self = this, _initTime = new Date().getTime();
        let timer = setInterval(function(){
          let nowTime = new Date();
          let endTime = new Date(timestamp * 1000 + _initTime);
          let t = endTime.getTime() - nowTime.getTime();
          if(t>0){
            let day = Math.floor(t/86400000);
            let hour=Math.floor((t/3600000)%24);
            let min=Math.floor((t/60000)%60);
            let sec=Math.floor((t/1000)%60);
            hour = hour + day * 24;
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            if(day > 0){
              // format =  `${day}天${hour}小时${min}分${sec}秒`;
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour > 0 ){
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour <= 0){
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
          }else{
            clearInterval(timer);
            self._callback();
          }
        },1000);
      },
      _callback(){
        if(this.callback && this.callback instanceof Function){
          this.callback(...this);
        }
      }
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

      index_data: config.index_n,

      search: '',
      swipe_banner: '',
      swipe_presale: '',
      banners: config.index_n.adSwiper,
      preSales: config.index_n.promotion,
      auctions: config.index_n.auction,
      auctions_data: config.index_n.auction.slice(1),
      artists: config.index_n.artist,
      artists_data: config.index_n.artist.slice(1),
      recommends: config.index_n.product,

      tagN: config.index_n.tagNames

    },
    watch: {

    },
    methods: {
      initData(){
        let vue = this;

      },
      clear(){
        let vue = this;
        vue.search = '';
      },
      subSearch(){
        let vue = this;
        let _url = config.searchUrl;
        if(vue.search){
          _url += vue.search;
          location.href = _url;
        }

      },
      end(){
        console.log('end')
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
