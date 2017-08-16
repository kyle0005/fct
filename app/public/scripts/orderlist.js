let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.tab_num = config.status;
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
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      showConfirm: false, /* 显示confirm组件 */
      show_search: false,
      placeholder: '',
      keywords: '',
      orderlist: config.orderlist.entries,
      tabs: ['全部', '待付款', '待发货', '待收货', '待评价'],
      tab_num: 0,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.orderlist.pager,
      status: config.status || -1,
      orderId: null,
      callback: null,
      subText: '取消',

      listloading: false,
      nodata: false
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      cancel(orderId){
        let vue = this,
          post_url = config.cancel_url + '/' + orderId + '/cancel',
          post_data = {};
        // vue.$refs.subpost.post(post_url, post_data);
        jAjax({
          type:'post',
          url:post_url,
          data: post_data,
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
               vue.succhandle(data);
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
          }
        });
      },
      todetail(item){
        let vue = this;
        location.href = config.detail_url + '/' + item.orderId;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.orderlist_url + '?status=' + vue.status + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            tools.ajaxGet(_url, vue.nextSucc, vue.getBefore);
          }

        }
      },
      category(i){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = i;
        vue.nodata = false;
        vue.orderlist = {};
        vue.pager = {};
        vue.status = i;
        var _url = config.orderlist_url + '?status=' + vue.status;
        if(i == 3){
          _url = _url + '&comment_status=0';
        }
        tools.ajaxGet(_url, vue.cateSucc, vue.getBefore);

      },
      subSearch(){
        let vue = this;
        vue.nodata = false;
        tools.ajaxGet(config.search_url + '?keyword=' + vue.keywords, vue.searchSucc, vue.getBefore);
      },

      search(num){
        let vue = this;
        if(vue.show_search){
          vue.placeholder = '';
          if(num == 1){
            vue.subSearch();
            vue.keywords = '';
          }
        }else {
          vue.placeholder = '请输入订单号或者商品名称';
        }
        vue.show_search = !vue.show_search;


      },
      confirm(orderId, callback){
        let vue = this;
        vue.msg = '您确认要执行此操作？';
        vue.orderId = orderId;
        vue.callback = callback;
        vue.showConfirm = true;
      },
      no(){
        let vue = this;
        vue.showConfirm = false;
      },
      ok(callback, obj){
        let vue = this;
        vue.showConfirm = false;
        if(callback){
          callback(obj);
        }
      },

      searchSucc(data){
        let vue = this;
        vue.orderlist = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
        if(vue.orderlist.length > 0){
          vue.nodata = false;
        }else {
          vue.nodata = true;
        }
      },
      cateSucc(data){
        let vue = this;
        vue.orderlist = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
        if(vue.orderlist.length > 0){
          vue.nodata = false;
        }else {
          vue.nodata = true;
        }

      },
      nextSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.orderlist = data.data.entries.concat(vue.orderlist);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
      },
      succhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
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
      }
    },
  }
).$mount('#orderlist');
