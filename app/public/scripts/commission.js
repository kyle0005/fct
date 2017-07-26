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
      commissionlist: config.commissionlist.entries,
      pager: config.commissionlist.pager,
      status: 0,
      tabs: ['等待结算', '结算成功'],
      tab_num: 0,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
    },
    watch: {
    },
    methods: {
      category(index){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        if(index == 0){
          vue.status = 0;
        }else {
          vue.status = 2;
        }
        var _url = config.commissionUrl + '?status=' + vue.status;
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
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.commissionUrl + '?status=' + vue.status + '&page=' + vue.pager.next;
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
                    vue.commissionlist = data.data.entries.concat(vue.commissionlist);
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
      getCoupon(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.coupon_url,
          data: {
            'validateCoupon': config.validateCoupon,
            'couponCode': vue.couponcode,
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            //{message:"xxx", url:"", code:200, data:""}
            if(data){
              data = JSON.parse(data);
              vue.showCoup();
              if(parseInt(data.code) == 200){
                vue.coupon.couponAmount = data.data;
                vue.coupon.couponCode = vue.couponcode;
                vue.loadCoupon();
                vue.calculateAmount(0);
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

    },
  }
).$mount('#commission');
