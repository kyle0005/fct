let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容

      shareList: config.share.entries,
      pager: config.share.pager,

      productsType: config.productsType,
      sort: config.sort,

      sortsel: 0,
      categary: config.productsType[0].code,

      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      search: '',
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
    methods: {
      subSearch(){
        let vue = this;
        let _url = config.shareUrl + '?';
        if(vue.categary){
          _url += '&code=' + vue.categary;
        }
        if(vue.sortsel){
          _url += '&sort=' + vue.sortsel;
        }
        if(vue.search){
          jAjax({
            type:'post',
            url: _url,
            data: {
              'keyword': vue.search
            },
            timeOut:5000,
            before:function(){
              console.log('before');
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                if(parseInt(data.code) == 200){
                  vue.shareList = data.data.entries;
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
        }

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
                    vue.shareList = data.data.entries.concat(vue.shareList);
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
      sel(){
        let vue = this;
        let _url = config.shareUrl + '?sort=' + vue.sortsel + '&page=' + vue.pager.next;
        if(vue.categary){
          _url += '&code=' + vue.categary;
        }
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
                vue.shareList = data.data.entries;
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
      cate(){
        let vue = this;
        let _url = config.shareUrl + '?code=' + vue.categary + '&page=' + vue.pager.next;
        if(vue.sortsel){
          _url += '&sort=' + vue.sortsel;
        }
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
                vue.shareList = data.data.entries;
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
