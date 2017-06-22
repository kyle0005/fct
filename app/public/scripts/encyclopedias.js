Vue.component('m-swipe',
  {
    template: '#m_swipe',
    computed: {
    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
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
        spaceBetween: That.spaceBetween,
        //特效
        effect: That.effect, //slide,fade,coverflow,cube
        autoplayDisableOnInteraction: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        height : window.innerHeight,
        lazyLoading: true,
        paginationBulletRender: function (swiper, index, className) {
              return '<span class="en-pagination ' + className + '"></span>';
            }
      })
    },
    components: {
    }
  }
);
let app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      let vue = this;
      vue.getProductsType();
      let swiper = this.$refs.swiper;
      if (swiper.dom) {
        this.swiper = swiper.dom;
      }

      vue.getProductsOtherType();
      let swipert = this.$refs.swipert;
      if (swipert.dom) {
        this.swipert = swipert.dom;
      }
    },
      activated() {

    },
    deactivated() {

    },
    data: {
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      img_url: 'public/images',
      currentView: 'overview',
      tabs: [],
      tab_num: 0,
      list: [],
      swiper: '',

      tabs_t: [],
      tab_num_t: 0,
      swipert: '',
      list_t: []

    },
    watch: {
    },
    methods: {
      search(){

      },
      getProductsType() {
        let vue = this;
        jAjax({
          type:'get',
          url:apis.encyclopedias_type,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.tabs = (data);
              vue.linkTo(0);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      linkTo(num){
        let vue = this;
        this.tab_num = num;
        jAjax({
          type:'get',
          url:apis.encyclopedias_type + '?id=' + num,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              console.log(data);
              let _data = data[0].data;
              let resLength = _data.length;
              let tmp = [];
              for (let i = 0, j = 0; i < resLength; i += 12, j++) {
                tmp[j] = _data.splice(0, 12);
              }
              vue.list = tmp;
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      getProductsOtherType() {
        let vue = this;
        jAjax({
          type:'get',
          url:apis.encyclopedias_other,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.tabs_t = (data);
              vue.linkToOther(0);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      linkToOther(num){
        let vue = this;
        this.tab_num_t = num;
        jAjax({
          type:'get',
          url:apis.encyclopedias_other + '?id=' + num,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              console.log(data);
              let _data = data[0].data;
              let resLength = _data.length;
              let tmp = [];
              for (let i = 0, j = 0; i < resLength; i += 12, j++) {
                tmp[j] = _data.splice(0, 12);
              }
              vue.list_t = tmp;
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
    },
    components: {
    }
  }
).$mount('#encyclopedias');
