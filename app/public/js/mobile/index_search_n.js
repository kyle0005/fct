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
      priV: null,

      lowvol: 0,
      highvol: 0,

      showTop: false,
      search: config.search.keyword || '',
      result: [],
      pager: config.result.pager,

      _url: '',
      sorts_code: 0,
      artists_code: 0,
      cate_code: '',

      sort_tab: -1,
      art_tab: -1,
      pri_tab: -1,
      vol_tab: -1,
      cat_tab: -1,

      pri_cache_tab: -1,
      vol_cache_tab: -1,

      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,

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
      }
    },
    methods: {
      toggle(num){
        let vue = this;
        if(num === -1){
          /* 关闭窗口 */
          vue.open = false;
          vue.docked = false;

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
        vue.changeS(item.value, -10, null)
      },
      artistsV(item, n){
        let vue = this;
        vue.art_tab = n;
        vue.changeS(-10, item.value, null)
      },
      priceSortsV(n){
        let vue = this;
        vue.pri_cache_tab = n;
      },
      priceSortsVOK(){
        let vue = this;
        if(vue.priceSorts[vue.pri_cache_tab] && vue.priceSorts[vue.pri_cache_tab].value){
          vue.priV = vue.priceSorts[vue.pri_cache_tab].value;
        }
        vue.pri_tab = vue.pri_cache_tab;
        vue.changeS(-10, -10, null);
      },
      volumesV(n){
        let vue = this;
        vue.vol_cache_tab = n;
      },
      volumesVOK(){
        let vue = this;
        if(vue.volumes[vue.vol_cache_tab] && vue.volumes[vue.vol_cache_tab].min && vue.lowvol < 1){
          vue.lowvol = vue.volumes[vue.vol_cache_tab].min;
        }
        if(vue.volumes[vue.vol_cache_tab] && vue.volumes[vue.vol_cache_tab].max && vue.highvol < 1){
          vue.highvol = vue.volumes[vue.vol_cache_tab].max;
        }
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
