let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
    },
    data: {
      ranks_list: config.productsRank,
      pro_list: [],
      loading: false,
      refreshing: false,
      msg: 0,
      isindex: config.isindex,
      code: '',
      _code: '',
      tab_num: null,

      listloading: true,
      nodata: false,

      pager_url: '',
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.products.pager
    },
    directives: {
      'load-more': {
        bind: (el, binding) => {
          let windowHeight = window.screen.height;
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
    },
    watch: {
      pro_list: function (val, oldVal) {
        if(!this.listloading){
          if(this.pro_list && this.pro_list.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      initData(){
        let vue = this;
        vue.pro_list = config.products.entries;
        vue.listloading = false;
        vue.tab_num = 0;
      },
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      /* 菜单分类加载 */
      getprolist(code, level_id, index) {
        let vue = this;
        vue.tab_num = index || 0;
        vue.pro_list = {};
        vue.nodata = false;

        let _url = '';
        code = code || '';
        level_id = level_id || 0;
        if (code != '') {
          _url = '?code=' + code;
          if (level_id > 0) {
            _url += '&level_id=' + level_id;
          }
        } else {
          if (level_id >= 0) {
            code = vue.code;
            _url = '?level_id=' + level_id;
            if (code != '') {
              _url += '&code=' + code;
            }
          }
        }
        vue._code = code;
        _url = config.product_url + _url;
        vue.pager_url = _url;
        tools.ajaxGet(_url, vue.getSucc, vue.getBefore);

      },
      getSucc(data){
        let vue = this;
        vue.pro_list = data.data.entries;
        vue.pager = data.data.pager;
        vue.code = vue._code;

        vue.listloading = false;

      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = vue.pager_url + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.pro_list = data.data.entries.concat(vue.pro_list);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
      },
    },
  }
).$mount('#main');
