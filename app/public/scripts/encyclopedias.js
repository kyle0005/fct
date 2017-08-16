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
Vue.component('m-search',
  {
    template: '#search',
    mounted: function() {
    },
    data() {
      return {
        show_search: false,
        placeholder: '',
        keywords: '',
      }
    },
    methods: {
      search(num){
        let vue = this;
        if(vue.show_search){
          vue.placeholder = '';
          if(num == 1){
            vue.$emit('subSearch', vue.keywords);
            vue.keywords = '';
          }
        }else {
          vue.placeholder = '请输入关键字';
        }
        vue.show_search = !vue.show_search;
      },
    }
  }
);
Vue.component('info',
  {
    template: '#info',
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
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg'],
    methods: {
      close(){
        this.$emit('close')
      }
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
    data: {
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      img_url: 'public/images',
      currentView: 'overview',
      tabs: [],     /* 顶部分类 */
      tab_num: 0,
      list: [],
      swiper: '',

      tabs_t: [],
      tab_num_t: 0,
      swipert: '',
      list_t: [],

      showAlert: false,
      msg: null,

      wikiCategories: config.wikiCategories,
      materials: config.materials,

      listloading: false,
      nodata: false

    },
    methods: {
      close(){
        this.showAlert = false;
      },
      showinfo(item){
        let vue = this;
        vue.showAlert = true;
        vue.msg = item;
      },
      getProductsType() {
        let vue = this;
        vue.wikiCategories.forEach((item) => {
          vue.tabs.push(item.name);
        });
        vue.linkTo(0);

      },
      linkTo(num){
        let vue = this, _data = [];
        vue.list = {};
        vue.tab_num = num;
        _data = vue.wikiCategories[num].subList;
        let resLength = _data.length;
        let _tmp = [];
        for (let i = 0, j = 0; i < resLength; i += 12, j++) {
          _tmp[j] = _data.slice(0, 12);
        }
        vue.list = _tmp;

      },
      getProductsOtherType() {
        let vue = this;
        vue.linkToOther(0);
      },
      linkToOther(num){
        let vue = this;
        let _data = vue.materials;
        let resLength = _data.length;
        let tmp = [];
        for (let i = 0, j = 0; i < resLength; i += 20, j++) {
          tmp[j] = _data.slice(0, 20);
        }
        vue.list_t = tmp;
      },
      subSearch(keywords){
        let vue = this, _list = [];
        vue.list = [];
        _list = vue.wikiCategories[vue.tab_num].subList;


        vue.listloading = false;
        if(vue.orderlist.length > 0){
          vue.nodata = false;
        }else {
          vue.nodata = true;
        }
      },
    },
    components: {
    }
  }
).$mount('#encyclopedias');
