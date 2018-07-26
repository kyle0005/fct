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

      open: false,
      docked: false,
      showPop: 0,
      sorts: config.sorts,
      artists: config.artists,

      _url: '',
      sorts_code: 0,
      artists_code: 0,

      sort_tab: 0,
      art_tab: -1,

      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      search: '',
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,

      show: false,   /* 显示qrcode */
      qrurl: '',
      qrname: '',
      isLastPage: false

    },
    methods: {
      initData(){
        let vue = this;
        vue._url = config.shareUrl + '?keyword=' + vue.search;
        vue.shareList = config.share.entries;
        vue.listloading = false;
      },

      toggle(num){
        let vue = this;
        if(num === -1){
          /* 关闭窗口 */
          vue.open = false;
          vue.docked = false;
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
      changeS(sorts_code, artists_code){
        let vue = this;
        if(sorts_code !== -10){
          vue.sorts_code = sorts_code;
        }
        if(artists_code !== -10){
          vue.artists_code = artists_code;
        }

        let _u = vue._url + '&sort=' + vue.sorts_code
          + '&author=' + vue.artists_code;
        console.log(_u);
        tools.ajaxGet(_u, vue.searchSuc, vue.getBefore);
      },
      sortsV(item, n){
        let vue = this;
        vue.sort_tab = n;
        vue.priV = null;
        vue.changeS(item.value, -10);
      },
      artistsV(item, n){
        let vue = this;
        if(n == vue.art_tab){
          /* 点击取消 */
          vue.art_tab = -1;
          vue.changeS(-10, 0)
        }else {
          vue.art_tab = n;
          vue.changeS(-10, item.value)
        }
      },

      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      subSearch(){
        let vue = this;
        vue.nodata = false;
        let _url = config.shareUrl + '?';
        if(vue.sorts_code){
          _url += '&code=' + vue.sorts_code;
        }
        if(vue.artists_code){
          _url += '&sort=' + vue.artists_code;
        }
        if(vue.search){
          tools.ajaxGet(_url + '&keyword=' + vue.search, vue.searchSuc, vue.getBefore);
        }else {
          tools.ajaxGet(_url + '&keyword=', vue.searchSuc, vue.getBefore);
        }

      },
      searchSuc(data){
        let vue = this;
        vue.shareList = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
        vue.toggle(-1);
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
          if(vue.sorts_code){
            _url += '&code=' + vue.sorts_code;
          }
          if(vue.artists_code){
            _url += '&sort=' + vue.artists_code;
          }
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }else {
          vue.isLastPage = true;
        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.shareList = vue.shareList.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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
