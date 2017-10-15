let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    watch: {
      shareList: function (val, oldVal) {
        if(!this.listloading){
          if(this.shareList && this.shareList.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容

      shareList: [],
      pager: config.share.pager,

      productsType: config.productsType,
      sort: config.sort,

      sortsel: 0,
      categary: config.productsType[0].code,

      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      search: '',
      listloading: true,
      nodata: false

    },
/*    directives: {
      'load-more': {
        bind: (el, binding) => {
          let windowHeight = window.screen.height;
          // let windowHeight = el.parentNode.offsetHeight;
          let height;
          let setTop;
          let paddingBottom;
          let marginBottom;
          let requestFram;
          let oldScrollTop;
          let scrollEl;
          let heightEl;
          let scrollType = el.attributes.type && el.attributes.type.value;
          let scrollReduce = 2;
          if (scrollType == 2) {
            scrollEl = el;
            heightEl = el.children[0];
          } else {
            scrollEl = document.body;
            heightEl = el;
          }

          el.addEventListener('touchstart', () => {
            height = heightEl.clientHeight;
            if (scrollType == 2) {
              height = height
            }
            setTop = el.offsetTop;
            paddingBottom = tools.getStyle(el, 'paddingBottom');
            marginBottom = tools.getStyle(el, 'marginBottom');
          }, false)

          el.addEventListener('touchmove', () => {
            loadMore();
          }, false)

          el.addEventListener('touchend', () => {
            oldScrollTop = scrollEl.scrollTop;
            moveEnd();
          }, false);

          const moveEnd = () => {
            requestFram = requestAnimationFrame(() => {
              if (scrollEl.scrollTop != oldScrollTop) {
                oldScrollTop = scrollEl.scrollTop;
                moveEnd()
              } else {
                cancelAnimationFrame(requestFram);
                height = heightEl.clientHeight;
                loadMore();
              }
            })
          };

          const loadMore = () => {
            if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
              binding.value();
            }
          }
        }
      }
    },*/
    methods: {
      initData(){
        let vue = this;
        vue.shareList = config.share.entries;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      subSearch(){
        let vue = this;
        vue.nodata = false;
        let _url = config.shareUrl + '?';
        if(vue.categary){
          _url += '&code=' + vue.categary;
        }
        if(vue.sortsel){
          _url += '&sort=' + vue.sortsel;
        }
        if(vue.search){
          tools.ajaxGet(_url + '&keyword=' + vue.search, vue.searchSuc, vue.getBefore);
        }

      },
      searchSuc(data){
        let vue = this;
        vue.shareList = data.data.entries;
        vue.pager = data.data.pager;
      },
      searchTxt(){
        let vue = this;
        console.log(vue.search)
      },
      clear(){
        let vue = this;
        vue.search = '';
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.shareUrl + '?page=' + vue.pager.next;
          if(vue.categary){
            _url += '&code=' + vue.categary;
          }
          if(vue.sortsel){
            _url += '&sort=' + vue.sortsel;
          }
          if(_url !== vue.last_url){
            vue.last_url = _url;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.shareList = vue.shareList.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
      },
      sel(){
        let vue = this;
        vue.nodata = false;
        let _url = config.shareUrl + '?sort=' + vue.sortsel + '&page=' + vue.pager.next;
        if(vue.categary){
          _url += '&code=' + vue.categary;
        }
        tools.ajaxGet(_url, vue.selSucc, vue.getBefore);
      },
      selSucc(data){
        let vue = this;
        vue.shareList = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
      },
      cate(){
        let vue = this;
        vue.nodata = false;
        let _url = config.shareUrl + '?code=' + vue.categary + '&page=' + vue.pager.next;
        if(vue.sortsel){
          _url += '&sort=' + vue.sortsel;
        }
        tools.ajaxGet(_url, vue.cateSucc, vue.getBefore);
      },
      cateSucc(data){
        let vue = this;
        vue.shareList = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
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
).$mount('#share');
