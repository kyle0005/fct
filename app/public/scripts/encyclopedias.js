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
    props: {
      dat: {
        type: Array,
        default: []
      },
      sid: {
        type: String,
        default: ''
      },
    },
    methods: {
      search(num){
        let vue = this;
        if(vue.show_search){
          vue.placeholder = '';
          if(num == 1){
            let _data = {}, _tmp = [];
            _data.keywords = vue.keywords;
            for (let i = 0; i < vue.dat.length; i++) {
              _tmp = _tmp.concat(vue.dat[i]);
            }
            _data.dat = _tmp;
            _data.sid = vue.sid;
            vue.$emit('subsearch', _data);
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
      if (swiper && swiper.dom) {
        this.swiper = swiper.dom;
      }

      vue.getProductsOtherType();
      let swipert = this.$refs.swipert;
      if (swipert && swipert.dom) {
        this.swipert = swipert.dom;
      }

      vue.getTermType();
      let swiperterm = this.$refs.swiperterm;
      if (swiperterm && swiperterm.dom) {
        this.swiperterm = swiperterm.dom;
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

      swiperterm: '',
      list_term: [],

      showAlert: false,
      msg: null,

      wikiCategories: config.wikiCategories,
      materials: config.materials,
      term: config.term,

      listloading: true,
      nodata: false,

      listloading_t: true,
      nodata_t: false,

      listloading_term: true,
      nodata_term: false,

    },
    watch: {
      list: function (val, oldVal) {
        if(!this.listloading){
          if(this.list && this.list.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      },
      list_t: function (val, oldVal) {
        if(!this.listloading_t){
          if(this.list_t && this.list_t.length > 0){
            this.nodata_t = false;
          }else {
            this.nodata_t = true;
          }
        }
      },
      list_term: function (val, oldVal) {
        if(!this.listloading_term){
          if(this.list_term && this.list_term.length > 0){
            this.nodata_term = false;
          }else {
            this.nodata_term = true;
          }
        }
      },
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
        vue.list = [];
        vue.tab_num = num;
        if(vue.wikiCategories.length > 0){
          _data = vue.wikiCategories[num].subList;
          let resLength = _data.length;
          let _tmp = [];
          for (let i = 0, j = 0; i < resLength; i += 12, j++) {
            _tmp[j] = _data.slice(i, 12 + i);
          }
          vue.nodata = false;
          vue.listloading = true;
          vue.list = _tmp;
          vue.listloading = false;
        }
      },

      getProductsOtherType() {
        let vue = this;
        vue.linkToOther(0);
      },
      linkToOther(num){
        let vue = this;
        vue.list_t = [];
        let _data = vue.materials;
        if(_data.length > 0){
          let resLength = _data.length;
          let tmp = [];
          for (let i = 0, j = 0; i < resLength; i += 20, j++) {
            tmp[j] = _data.slice(i, i + 20);
          }
          vue.nodata_t = false;
          vue.listloading_t = true;
          vue.list_t = tmp;
          vue.listloading_t = false;
        }

      },

      getTermType() {
        let vue = this;
        vue.linkToTerm(0);
      },
      linkToTerm(num){
        let vue = this;
        vue.list_term = [];
        let _data = vue.term;
        if(_data.length > 0){
          let resLength = _data.length;
          let tmp = [];
          for (let i = 0, j = 0; i < resLength; i += 20, j++) {
            tmp[j] = _data.slice(i, i + 20);
          }
          vue.nodata_term = false;
          vue.listloading_term = true;
          vue.list_term = tmp;
          vue.listloading_term = false;
        }

      },

      upSearch(obj){
        let vue = this, _data = [];
        vue.list = [];
        _data = vue.searchNotes(obj.dat, obj.keywords); /* 搜索 */
        let resLength = _data.length;
        let _tmp = [];
        for (let i = 0, j = 0; i < resLength; i += 12, j++) {
          _tmp[j] = _data.slice(i, 12 + i);
        }
        vue.list = _tmp;

        vue.listloading = false;
      },
      downSearch(obj){
        let vue = this, _data = [];
        vue.list_t = [];
        _data = vue.searchNotes(obj.dat, obj.keywords); /* 搜索 */
        let resLength = _data.length;
        let _tmp = [];
        for (let i = 0, j = 0; i < resLength; i += 20, j++) {
          _tmp[j] = _data.slice(i, 20 + i);
        }
        vue.list_t = _tmp;

        vue.listloading_t = false;
      },
      termSearch(obj){
        let vue = this, _data = [];
        vue.list_term = [];
        _data = vue.searchNotes(obj.dat, obj.keywords); /* 搜索 */
        let resLength = _data.length;
        let _tmp = [];
        for (let i = 0, j = 0; i < resLength; i += 20, j++) {
          _tmp[j] = _data.slice(i, 20 + i);
        }
        vue.list_term = _tmp;

        vue.listloading_term = false;
      },

      subsearch(obj){
        let vue = this, _data = [];
        if(obj.sid == 'up'){
          vue.upSearch(obj);
        }
        if(obj.sid == 'down'){
          vue.downSearch(obj);
        }
        if(obj.sid == 'term'){
          vue.termSearch(obj);
        }

      },
      searchNotes(data, value) {
        var aData = [],
          aSearch = value.split(' '),
          k = 0,
          regStr = '',
          reg;
        for (var r = 0, lenR = aSearch.length; r < lenR; r++) {
          regStr += '(' + aSearch[r] + ')([\\s\\S]*)';
        }
        reg = new RegExp(regStr);

        for (var i = 0, lenI = data.length; i < lenI; i++) {
          var title = data[i].name,
            regMatch = title.match(reg),
            searchData = {};
          k = 0;
          if (regMatch !== null) {
            // var replaceReturn = '';
            // for (var j = 1, lenJ = regMatch.length; j < lenJ; j++) {
            //   if (regMatch[j] === aSearch[k]) {
            //     replaceReturn += '<span style="color:red;">$' + j + '</span>';
            //     k++;
            //   } else {
            //     replaceReturn += '$' + j;
            //   }
            // }

            for (var obj in data[i]) {
              if (data[i].hasOwnProperty(obj)) {
                searchData[obj] = data[i][obj];
              }
            }
            // searchData.Title = searchData.Title.replace(reg, replaceReturn);
            aData.push(searchData);
          }
        }
        return aData;
      }
    },
    components: {
    }
  }
).$mount('#encyclopedias');
