let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.initData();
    },
/*    directives: {
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
    },*/
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      commissionlist: [],
      pager: {},
      status: 0,
      tabs: ['等待结算', '结算成功'],
      tab_num: 0,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false
    },
    watch: {
      commissionlist: function (val, oldVal) {
        if(!this.listloading){
          if(this.commissionlist && this.commissionlist.length > 0){
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
        vue.commissionlist = config.commissionlist.entries;
        vue.pager = config.commissionlist.pager;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      category(index){
        let vue = this;
        vue.nodata = false;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        if(index == 0){
          vue.status = 0;
        }else {
          vue.status = 2;
        }
        vue.commissionlist = [];
        vue.nodata = false;
        var _url = config.commissionUrl + '?status=' + vue.status;
        tools.ajaxGet(_url, vue.cateSucc, vue.getBefore);

      },
      cateSucc(data){
        let vue = this;
        vue.commissionlist = [];
        vue.commissionlist = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.commissionUrl + '?status=' + vue.status + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.commissionlist = vue.commissionlist.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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
).$mount('#commission');
