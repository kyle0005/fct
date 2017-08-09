Vue.component('live',
  {
    template: '#live',
    computed: {
      topImg: function () {
        let vue = this, flag = false;
        config.artist.dynamicList.entries.forEach((item) => {
          if(item.isTop){
            vue.top = item;

          }
        });
        if(vue.top.images.length > 0){
          flag = true;
        }
        return flag;
      },
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
    mounted: function() {
      let vue = this;
      vue.loadLive();
    },
    data() {
      return {
        dynamicList: config.artist.dynamicList,
        liveList: config.artist.dynamicList.entries,
        top: {},
        preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
        last_url: ''
      }
    },
    methods:{
      nextPage() {
        let vue = this,
          scrollTop = document.body.scrollTop,
          clientHeight = document.body.clientHeight,
          scrollHeight = document.body.scrollHeight;
        vue.preventRepeatReuqest = true;
        /* scrollTop + clientHeight == scrollHeight &&  */
        if(vue.dynamicList.pager.next > 0){
          var _url = config.artistPage_url + '?page=' + vue.dynamicList.pager.next;
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
                    vue.dynamicList = data.data;
                    vue.liveList = data.data.entries.concat(vue.liveList);
                    vue.loadLive();
                    vue.preventRepeatReuqest = false;
                    console.log('ok')
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
      loadLive(){
        let vue = this;
        vue.liveList.forEach((item, index) => {
          if(item.isTop){
            vue.liveList.splice(index, 1);
            vue.$nextTick(function () {
              // DOM 更新后回调
              vue.loadVideo('video_top', item.url, item.videoImage);
            });
          }else {
            vue.$nextTick(function () {
              // DOM 更新后回调
              vue.loadVideo('video_' + index, item.url, item.videoImage);
            });
          }

        });
      },
      loadVideo(id ,url, poster){
        let vue = this;
        if(id && url && poster){
          var options = {
            fluid: true,
            aspectRatio: '2:1',
            preload: 'auto',
            poster: poster
          };
          var player = videojs(id, options, function onPlayerReady() {
            this.src(url);
            videojs.log('Your player is ready!');
            this.play();
            this.on('ended', function() {
              videojs.log('Awww...over so soon?!');
            });
          });
        }

      },
    },
  }
);
Vue.component('works',
  {
    template: '#works',
    mounted: function() {
      let vue = this;
      vue.loadWorks();
    },
    data() {
      return {
        workslist: [],
        last_url: '',

      }
    },
    methods: {
      loadWorks() {
        let vue = this;
        var _url = config.artistWorks_url;
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
                  vue.workslist = data.data;

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
      },
    },
  }
);
Vue.component('chat',
  {
    template: '#chat',
    computed: {
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
    mounted: function() {
      let vue = this;
      vue.loadChat();
    },
    data() {
      return {
        chatlist: [],
        last_url: '',
        pager: {},
        open: false,
        docked: false,
        preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
        message: '', /* 提交聊天内容 */
        subText: '发送'
      }
    },
    methods: {
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.artistChat_url + '?page=' + vue.pager.next;
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
                    vue.chatlist = data.data.entries.concat(vue.chatlist);
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
      popchat() {
        let vue = this;
        if (!vue.open) {
          vue.docked = true;
          vue.open = true;
        } else {
          vue.open = false;
          setTimeout(function() {
            vue.docked = false;
          }, 300);
        }
      },
      send(){
        let vue = this,
          data = {
            'message': vue.message
          };
        vue.$refs.subpost.post(config.chat_url, data);

        /*jAjax({
          type:'post',
          url:config.chat_url,
          data: {
            'message': vue.message,
          },
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            //{message:"xxx", url:"", code:200, data:""}
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.msg = '留言提交成功，我们将通知“'+ config.artist.name +'”给您回复，请留意！';
                vue.showAlert = true;
                vue.close_auto();

                vue.popchat();
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
          }
        });*/
      },
      loadChat() {
        let vue = this;
        var _url = config.artistChat_url;
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
                  vue.chatlist = data.data.entries;
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
        }
      },

      succhandle(data){
        let vue = this;
        vue.msg = '留言提交成功，我们将通知“'+ config.artist.name +'”给您回复，请留意！';
        vue.showAlert = true;
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
        vue.popchat();
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
);
let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    activated() {
    },
    deactivated() {
    },
    data: {
      haslive: true,
      currentView: 'live',
      tabs: ['实时动态', '相关作品', '对话艺人'],
      tab_num: 0,
      artist: config.artist,

    },
    watch: {
    },
    methods: {
      linkTo(num){
        let vue = this;
        this.tab_num = num;
        switch(parseInt(num))
        {
          case 0:
            vue.currentView ='live';
            break;
          case 1:
            vue.currentView ='works';
            break;
          case 2:
            vue.currentView ='chat';
            break;
          default:
            vue.currentView ='live';
        }

      },

    },
    components: {

    }
  }
).$mount('#artist');
