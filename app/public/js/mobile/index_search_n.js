let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
      window.addEventListener('scroll',function() {
        vue.showTop = (tools.getScrollTop()>=tools.getWindowHeight());
      }, false)
    },
    data: {
      filter: config.filter,
      open: false,
      docked: false,
      showPop: 0,
      sorts: config.search.sorts,
      artists: config.search.artists,
      priceSorts: config.search.priceSorts,
      volumes: config.search.volumes,
      categorys: config.search.categorys,

      lowpri: 0,
      highpri: 0,
      lowpri_cache: 0,
      highpri_cache: 0,
      priV: null,

      lowvol: 0,
      highvol: 0,
      lowvol_cache: 0,
      highvol_cache: 0,

      showTop: false,
      search: config.search.keyword || '',
      result: [],
      pager: config.result.pager,

      _url: '',
      sorts_code: 0,
      artists_code: 0,
      cate_code: '',

      sort_tab: 0,
      art_tab: -1,
      pri_tab: -1,
      vol_tab: -1,
      cat_tab: -1,

      pri_cache_tab: -1,
      vol_cache_tab: -1,

      tmp_vol_min_obj:{},
      tmp_vol_max_obj:{},

      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,
      isLastPage: false,

      showAlert: false, //显示提示组件
      msg: null, //提示的内容
    },
    watch: {
      result: function (val, oldVal) {
        if(!this.listloading){
          if(this.result && this.result.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      },
      lowvol_cache: function (val, oldVal) {
        let _this = this;
        _this.tmp_vol_min_obj = {};
        _this.volumes.forEach(function (item, index) {
          if(val == item.min){
            _this.tmp_vol_min_obj = item;
            _this.tmp_vol_min_obj.index = index;
          }
        });
        if(_this.tmp_vol_min_obj.min == _this.tmp_vol_max_obj.min
        && _this.tmp_vol_min_obj.max == _this.tmp_vol_max_obj.max){
          _this.vol_cache_tab = _this.tmp_vol_min_obj.index;
        }else {
          _this.vol_cache_tab = -1;
        }
      },
      highvol_cache: function (val, oldVal) {
        let _this = this;
        _this.tmp_vol_max_obj = {};
        _this.volumes.forEach(function (item, index) {
          if(val == item.max){
            _this.tmp_vol_max_obj = item;
            _this.tmp_vol_max_obj.index = index;
          }
        });
        if(_this.tmp_vol_min_obj.min == _this.tmp_vol_max_obj.min
          && _this.tmp_vol_min_obj.max == _this.tmp_vol_max_obj.max){
          _this.vol_cache_tab = _this.tmp_vol_max_obj.index;
        }else {
          _this.vol_cache_tab = -1;
        }
      },
    },
    methods: {
      toggle(num){
        let vue = this;
        if(num === -1){
          /* 关闭窗口 */
          vue.open = false;
          vue.docked = false;

          vue.lowpri_cache = vue.lowpri;
          vue.highpri_cache = vue.highpri;

          vue.lowvol_cache = vue.lowvol;
          vue.highvol_cache = vue.highvol;

          vue.pri_cache_tab = vue.pri_tab;
          vue.vol_cache_tab = vue.vol_tab;
        }else {
          if(num !== vue.showPop){
            vue.open = false;
            vue.docked = false;
            vue.showPop = num;
          }
          setTimeout(function () {
            vue.docked = !vue.docked;
            vue.open = !vue.open;
          },50);
        }

      },
      changeS(sorts_code, artists_code, cate_code){
        let vue = this;
        if(sorts_code !== -10){
          vue.sorts_code = sorts_code;
        }
        if(artists_code !== -10){
          vue.artists_code = artists_code;
        }
        if(cate_code !== null){
          vue.cate_code = cate_code;
        }

        let _u = vue._url + '&sort=' + (vue.priV|vue.sorts_code)
          + '&price_min=' + vue.lowpri + '&price_max=' + vue.highpri
          + '&author=' + vue.artists_code
          + '&volume_min=' + vue.lowvol + '&volume_max=' + vue.highvol
          + '&category_id=' + vue.cate_code;
        console.log(_u);
        tools.ajaxGet(_u, vue.searchSuc, vue.getBefore);
      },
      sortsV(item, n){
        let vue = this;
        vue.sort_tab = n;
        vue.priV = null;
        vue.changeS(item.value, -10, null);
      },
      artistsV(item, n){
        let vue = this;
        if(n == vue.art_tab){
          /* 点击取消 */
          vue.art_tab = -1;
          vue.changeS(-10, 0, null)
        }else {
          vue.art_tab = n;
          vue.changeS(-10, item.value, null)
        }
      },
      priceSortsV(n){
        let vue = this;
        if(n == vue.pri_cache_tab){
          /* 点击取消 */
          vue.pri_cache_tab = -1;
        }else {
          vue.pri_cache_tab = n;
        }
      },
      priceSortsVOK(){
        let vue = this;
        if(vue.priceSorts[vue.pri_cache_tab] && vue.priceSorts[vue.pri_cache_tab].value){
          vue.priV = vue.priceSorts[vue.pri_cache_tab].value;
          vue.sort_tab = -1;
        }
        if(vue.pri_cache_tab == -1){
          vue.priV = null;
        }
        vue.lowpri = vue.lowpri_cache;
        vue.highpri = vue.highpri_cache;

        vue.pri_tab = vue.pri_cache_tab;
        vue.changeS(-10, -10, null);
      },
      volumesV(n){
        let vue = this;
        if(n == vue.vol_cache_tab){
          /* 点击取消 */
          vue.vol_cache_tab = -1;
          vue.lowvol_cache = 0;
          vue.highvol_cache = 0;
        }else {
          vue.vol_cache_tab = n;
          vue.lowvol_cache = vue.volumes[vue.vol_cache_tab].min;
          vue.highvol_cache = vue.volumes[vue.vol_cache_tab].max;
        }

      },
      volumesVOK(){
        let vue = this;
        vue.lowvol = vue.lowvol_cache;
        vue.highvol = vue.highvol_cache;

        vue.vol_tab = vue.vol_cache_tab;
        vue.changeS(-10, -10, null);
      },
      categorysV(item, n){
        let vue = this;
        vue.cat_tab = n;
        vue.changeS(-10, -10, item.code);
      },

      initData(){
        let vue = this;
        vue._url = config.url + '?keyword=' + vue.search;
        vue.result = config.result.entries;
        vue.pager = config.result.pager;
        vue.listloading = false;

        if(vue.filter){
          vue.search = vue.filter.keyword;
          vue.cate_code = vue.filter.category_id;
          vue.artists_code = vue.filter.artist_id;

          vue.lowvol = vue.filter.volume_min;
          vue.highvol = vue.filter.volume_max;
          vue.lowvol_cache = vue.filter.volume_min;
          vue.highvol_cache = vue.filter.volume_max;

          vue.lowpri = vue.filter.price_min;
          vue.highpri = vue.filter.price_max;
          vue.lowpri_cache = vue.filter.price_min;
          vue.highpri_cache = vue.filter.price_max;

          vue.sorts_code = vue.filter.sort;
          if(vue.filter.sort > 2){
            vue.priceSorts.forEach(function (item, index) {
              if(vue.filter.sort == item.value){
                vue.pri_tab = index;
              }
            });
          }else {
            vue.sorts.forEach(function (item, index) {
              if(vue.filter.sort == item.value){
                vue.sort_tab = index;
              }
            });
          }
          // vue.search = vue.filter.page_index;
        }
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          let _u = vue._url + '&sort=' + (vue.priV|vue.sorts_code)
            + '&price_min=' + vue.lowpri + '&price_max=' + vue.highpri
            + '&author=' + vue.artists_code
            + '&volume_min=' + vue.lowvol + '&volume_max=' + vue.highvol
            + '&category_id=' + vue.cate_code
            + '&page=' + vue.pager.next;
          if(_u !== vue.last_url){
            vue.last_url = _u;
            vue.isPage = true;
            tools.ajaxGet(_u, vue.nextSucc, vue.getBefore);
          }

        }else {
          vue.isLastPage = true;
        }
      },
      nextSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.result = vue.result.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      subSearch(){
        let vue = this;
        vue.nodata = false;
        if(vue.search && vue.search !== ''){
          vue._url = config.url + '?keyword=' + vue.search;
          tools.ajaxGet(vue._url, vue.searchSuc, vue.getBefore);
        }else {
          let _key = config.search.keyword;
          if(_key == undefined){
            _key = '';
          }
          vue._url = config.url + '?keyword=' + _key;
          tools.ajaxGet(vue._url, vue.searchSuc, vue.getBefore);
        }

      },
      searchSuc(data){
        let vue = this;
        vue.result = [];
        vue.pager = data.data.pager;
        vue.result = data.data.entries;
        vue.listloading = false;
        vue.toggle(-1);
      },
      end(){
        console.log('end')
      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
    },
  }
).$mount('#isearch');
