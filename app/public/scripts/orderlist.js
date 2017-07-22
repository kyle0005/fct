Vue.component('pop',
  {
    template: '#pop',
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
      show_search: false,
      placeholder: '',
      keywords: '',
      orderlist: config.orderlist.entries,
      tabs: ['全部', '待付款', '待发货', '待收货', '待评价'],
      tab_num: 0,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.orderlist.pager,
      status: ''
    },
    watch: {
    },
    methods: {
      todetail(item){
        let vue = this;
        location.href = config.detail_url + '?order_id=' + item.orderId;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.orderlist_url + '?status=' + vue.status + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            jAjax({
              type:'get',
              url:_url,
              timeOut:5000,
              before:function(){
                console.log('before');
              },
              success:function(data){
                if(data){
                  data = JSON.parse(data);
                  if(parseInt(data.code) == 200){
                    vue.pager = data.data.pager;
                    vue.orderlist = data.data.entries.concat(vue.orderlist);
                    vue.preventRepeatReuqest = false;
                  }else {
                    console.log('false')
                  }
                }

              },
              error:function(){
                console.log('error');
              }
            });
          }

        }
      },
      category(index){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        if(index == 0){
          vue.status = '';
        }else {
          vue.status = index - 1;
        }
        var _url = config.orderlist_url + '?status=' + vue.status;
        jAjax({
          type:'get',
          url:_url,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.orderlist = data.data.entries;
                vue.pager = data.data.pager;
              }else {
                console.log('false')
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      subSearch(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.search_url,
          data: {
            'keyword': vue.keywords
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.orderlist = data.data.entries;
                vue.pager = data.data.pager;
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });
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
    },
  }
).$mount('#orderlist');
