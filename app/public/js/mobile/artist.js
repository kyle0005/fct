Vue.component('mVideo',
  {
    template: '#m_video',
    data() {
      return {
        isVideoLoad: false,
      }
    },
    mounted: function() {
      let vue = this;

    },
    props: {
      poster: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: ''
      }
    },
    methods: {
      loadVideo(){
        let vue = this;
        vue.isVideoLoad = true;
        vue.$nextTick(function () {
          // DOM 更新后回调
          let _ref = document.getElementById(vue.id);
          _ref.play();

          _ref.addEventListener('fullscreenchange', function(){
            console.log(document.fullscreen)
          }, false);

          _ref.addEventListener('mozfullscreenchange', function () {
            console.log(document.mozFullScreen)
          }, false);

          _ref.addEventListener('webkitfullscreenchange', function () {
            console.log(document.webkitIsFullScreen)
          }, false);

          _ref.addEventListener('msfullscreenchange', function () {
            console.log(document.msFullscreenElement)
          }, false);
        });

      },
    }
  }
);
Vue.component('live',
  {
    template: '#live',
    watch: {
      liveList: function (val, oldVal) {
        if(!this.listloading){
          if(this.liveList && this.liveList.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    computed: {
      topImg: function () {
        let vue = this, flag = false, _tmp = [];
        config.artist.dynamicList.entries.forEach((item, index) => {
          if(item.isTop){
            vue.top = item;
          }else {
            _tmp.push(item);
          }
        });
        vue.liveList = _tmp;
        vue.listloading = false;

        if(vue.top.images && vue.top.images.length > 0){
          flag = true;
        }
        return flag;
      },
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
      },
    },*/
    mounted: function() {
      let vue = this;
    },
    data() {
      return {
        dynamicList: config.artist.dynamicList,
        liveList: [],
        top: {},
        preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
        last_url: '',
        isVideoLoad: false,

        listloading: true,
        pagerloading: false,
        isPage: false,
        nodata: false,
        isLastPage: false
      }
    },
    methods:{
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.dynamicList.pager.next > 0){
          var _url = config.artistPage_url + '?page=' + vue.dynamicList.pager.next;
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
        vue.dynamicList = data.data;
        vue.liveList = vue.liveList.concat(data.data.entries);
        vue.loadLive();
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
      },
      loadLive(){
        let vue = this;
        vue.liveList.forEach((item, index) => {
          if(item.isTop){
            let _tmp = vue.liveList;
            vue.liveList = [];
            _tmp.splice(index, 1);
            vue.liveList = _tmp;
            /*            vue.$nextTick(function () {
                          // DOM 更新后回调
                          vue.loadVideo('video_top', item.url, item.videoImage);
                        });*/
          }

        });
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
    watch: {
      workslist: function (val, oldVal) {
        if(!this.listloading){
          if(this.workslist && this.workslist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data() {
      return {
        workslist: [],
        last_url: '',
        listloading: true,
        pagerloading: false,
        isPage: false,
        nodata: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      loadWorks() {
        let vue = this;
        var _url = config.artistWorks_url;
        if(_url !== vue.last_url){
          vue.last_url = _url;
          tools.ajaxGet(_url, vue.workSucc, vue.getBefore);
        }
      },
      workSucc(data){
        let vue = this;
        vue.workslist = data.data;
        vue.listloading = false;
      }
    },
  }
);
Vue.component('chat',
  {
    template: '#chat',
    computed: {
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
    mounted: function() {
      let vue = this;
      vue.loadChat();
    },
    watch: {
      chatlist: function (val, oldVal) {
        if(!this.listloading){
          if(this.chatlist && this.chatlist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
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
        // subText: '发送',

        listloading: true,
        pagerloading: false,
        isPage: false,
        nodata: false,
        isLastPage: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.artistChat_url + '?page=' + vue.pager.next;
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
        vue.chatlist = vue.chatlist.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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

      },
      postSuc(data, index){
        let vue = this;
        vue.popchat();
      },
      postTip(data){
        let vue = this;
        vue.msg = '留言提交成功，我们将通知“'+ config.artist.name +'”给您回复，请留意！';
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },
      loadChat() {
        let vue = this;
        var _url = config.artistChat_url;
        if(_url !== vue.last_url){
          vue.last_url = _url;
          tools.ajaxGet(_url, vue.chatSucc, vue.getBefore);
        }
      },
      chatSucc(data){
        let vue = this;
        vue.chatlist = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
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
      haslive: false,
      currentView: 'live',
      tabs: ['实时动态', '相关作品', '对话艺人'],
      tab_num: 0,
      artist: config.artist,
      collected: config.artist.favoriteState
    },
    watch: {
    },
    methods: {
      collection(){
        let vue = this;
        tools.ajaxPost(config.fav_url, {}, vue.favSuc, vue.postBefore, vue.postError, {}, vue.postTip);
      },
      favSuc(data){
        let vue = this;
        vue.collected = data.data.favoriteState;
      },
      postSuc(data){
        let vue = this;
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
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
/*      setimgdata(data){
          let vue = this;
          vue.imgdata = data;
      }*/
    },
    components: {

    }
  }
).$mount('#artist');
