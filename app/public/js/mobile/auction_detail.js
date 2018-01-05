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
          _ref.addEventListener('ended', function(){
              //播放完成后
              vue.isVideoLoad = false;
            }
          );
        });

      },
    }
  }
);

Vue.component('m-swipe',
  {
    template: '#m_swipe',
    props: {
      swipeid: {
        type: String,
        default: ''
      },
      effect: {
        type: String,
        default: 'slide'
      },
      loop: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: 'horizontal'
      },
      pagination: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Number,
        default: 5000,
      },
      paginationType: {
        type: String,
        default: 'bullets'
      }
    },
    data(){
      return {
        dom:''
      }
    },
    mounted() {
      var That = this;
      this.dom = new Swiper('.' + That.swipeid, {
        //循环
        loop: That.loop,
        //分页器
        pagination: '.swiper-pagination',
        //分页类型
        paginationType: That.paginationType, //fraction,progress,bullets
        //自动播放
        autoplay: That.autoplay,
        //方向
        direction: That.direction,
        //特效
        effect: That.effect, //slide,fade,coverflow,cube
        autoplayDisableOnInteraction: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        height : window.innerHeight,
        lazyLoading: true,
        // paginationBulletRender: function (swiper, index, className) {
        //   return '<span class="en-pagination ' + className + '"></span>';
        // },
        onTransitionStart: function (swiper) {
          That.$emit('slideindex',swiper.activeIndex);
        }
      })
    },
    components: {
    }
  }
);

let app = new Vue(
  {
    data: {
      time_content: {
        day: '00',
        hour: '00',
        min: '00',
        sec: '00',
      },
      _sec: 0,
      product: config.product,
      chat_list: config.chatList,
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      currentPrice: config.product.bidPrice,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容,
      open: false,
      docked: false,
      chosen: false,
      swiper: '',
      tops: config.product.images,
      onId: 0,
      addpri: '',

      wsurl: config.ws_auction_url + '?token=' + config.product.token + '&relation_id=' + config.product.id,

      ws: {},
      wsMsg: '',

      isLiveLoad: true,
      app_id: config.app_id,
    },
    watch: {
      chat_list:function (val, oldVal){
        this.$nextTick(function(){
          let container = this.$el.querySelector('#chatContainer');
          console.log(container);
          container.scrollTop = container.scrollHeight;
        });
      }
    },
    mounted: function() {
      let vue = this;
      let swiper = this.$refs.swiper;
      if (swiper && swiper.dom) {
        this.swiper = swiper.dom;
      }

      let ele = document.querySelector('#chatContainer');
      let ham = new Hammer(ele);
      ham.on('swipeleft', function(ev) {
        console.log('swipeleft')
      });
      ham.on('swiperight', function(ev) {
        vue.choose();
      });

      vue.choose();
      if(vue.product.status && parseInt(vue.product.status) === 1){
        //如果是没有开始，不显示聊天
        vue.choose();
      }
      vue.init_ws();

      vue.vodLive(vue.product.liveId, vue.product.videoImg);

    },
    methods: {
      vodLive(live_url, img){
        let vue = this;
        var wid = window.screen.width;
        var hit = wid / (16 / 9);
        //live
        var PLAY_INFO = (function(){
          var ps = (window.location.href.split('?')[1] || '').split('&')
            , opt = {
              'channel_id': live_url,
              'app_id': vue.app_id,
              'width': 0,
              'height': 0,
              'https':0
            }
            , i1 = 0 , i2 = ps.length, i3, i4
          ;
          for (; i1 < i2; i1++) {
            i3 = ps[i1];
            i4 = i3.split('=');
            if(i4[0] == '$app_id' || i4[0] == 'app_id'){
              opt.app_id = i4[1];
            } else if(i4[0] == '$channel_id' || i4[0] == 'channel_id'){
              opt.channel_id = i4[1];
            } else if(i4[0] == '$sw' || i4[0] == 'sw'){
              opt.width = i4[1];
            } else if(i4[0] == '$sh' || i4[0] == 'sh'){
              opt.height = i4[1];
            } else if(i4[0] == 'cache_time'){
              opt.cache_time = i4[1];
            } else if(i4[0] == 'https'){
              opt.https = i4[1];
            }
          }

          return opt;
        })();
        (function () {
          new qcVideo.Player('id_video_container', {
            'channel_id': live_url,
            'app_id': vue.app_id,
            'width': wid,
            'height': hit,
            'https': 0,
            'auto_play':1,
            'h5_start_patch': {
              'url' : img,
              'stretch': true //是否拉伸图片铺面整个播放器，默认 false
            }
          });

        })();
        vue.isLiveLoad = false;
      },
      initTime(){
        let vue = this;
        let data = vue.product;
        let _sec = 0;
        if (data.status === 1) {
          _sec = parseInt((data.startTime - data.nowTime) / 1000);
        } else if (data.status !== 4) {
          _sec = parseInt((data.endTime - data.nowTime) / 1000);
        }
        vue._sec = _sec;
      },
      countdowm(timestamp){
        let self = this, _initTime = new Date().getTime();
        let timer = setInterval(function(){
          let nowTime = new Date();
          let endTime = new Date(timestamp * 1000 + _initTime);
          let t = endTime.getTime() - nowTime.getTime();
          if(t>0){
            let day = Math.floor(t/86400000);
            let hour=Math.floor((t/3600000)%24);
            let min=Math.floor((t/60000)%60);
            let sec=Math.floor((t/1000)%60);
            hour = hour + day * 24;
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            if(day > 0){
              // format =  `${day}天${hour}小时${min}分${sec}秒`;
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour > 0 ){
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour <= 0){
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
          }else{
            clearInterval(timer);
            self.end();
          }
        },1000);
      },

      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
      choose() {
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
      add(){
        let vue = this;
        let _entity = vue.product;
        let _myPrice = parseFloat(vue.addpri) || 0.00;
        let _currentPrice = parseFloat(vue.currentPrice);
        if (_entity.status === 3) {
          if (_myPrice < _currentPrice)
            _myPrice = _currentPrice + _entity.increasePrice;
          else
            _myPrice = _myPrice + _entity.increasePrice;
          vue.addpri = _myPrice;
        }

      },
      end(){
        let vue = this;
        if(vue.product.status !== 4){
          tools.ajaxGet(config.reload_url, this.reloadData_suc, this.reloadData_bef);
        }

      },
      reloadData_bef(){
        let vue = this;
      },
      reloadData_suc(data){
        let vue = this;
        vue.product = data.data;

        vue.initTime();
        vue.countdowm(this._sec);
        // vue.init_ws();
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
      },
      ws_reConnect(){
        let vue = this;
        let _t = null;
        let socket = new WebSocket(vue.wsurl);
        socket.addEventListener('open', function (event) {
          if(_t){
            clearTimeout(_t);
          }

        });
        socket.addEventListener('message', function (event) {
          vue.listenSocket(event)
        });
        socket.addEventListener('close', function (event) {
          _t = setTimeout(function(){
            vue.ws_reConnect();
          },1000);
        });
        vue.ws = socket;
      },
      init_ws(){
        let vue = this;
        let _hasFirst = vue.isEmpty(vue.product) ? false : true;

        //已经结束的就不用发起websocket了,第一次请求
        if (vue.product.status !== 4) {
          let _t = null;
          let socket = new WebSocket(vue.wsurl);
          socket.addEventListener('open', function (event) {
            if(_t){
              clearTimeout(_t);
            }
          });
          socket.addEventListener('message', function (event) {
            vue.listenSocket(event)
          });
          socket.addEventListener('close', function (event) {
            _t = setTimeout(function(){
              vue.ws_reConnect();
            },1000);
          });
          vue.ws = socket;
        }

        vue.setBidOn(vue.chat_list);
        // 自动滚动到最底部
        let container = vue.$el.querySelector('#chatContainer');
        container.scrollTop = container.scrollHeight;

        vue.initTime();
        vue.countdowm(this._sec);

      },
      listenSocket(res) {
        let that = this;
        if (that.isEmpty(res.data)) return ;

        let _data = JSON.parse(res.data);
        if(_data.code === 401){
          location.href = config.loginUrl;
        }
        if (_data.code !== 200) {
          that.msg = _data.msg;
          that.showAlert = true;
          that.close_auto();
          return ;
        }

        //出价次
        let _entity = that.product;
        if (_data.data.roleType === 1) {
          _data.data.bidStatus = 1;
          _entity.bidCount = _entity.bidCount + 1;
        }
        //加入聊天列表
        let _entities = that.chat_list;
        _entities.push(_data.data);

        console.log(_entities);

        that.chat_list = [];
        that.chat_list = _entities;

        console.log(that.chat_list);

        that.product = {};
        that.product = _entity;

        //设置出最高价的用户信息和价格
        if (_data.data.roleType === 1) {
          let _tmp = that.product;
          that.product = {};
          _tmp.product.bidUserHeadPortrait = _data.data.headPortrait;
          _tmp.product.bidUserName = _data.data.userName;
          _tmp.product.bidStatusName = _data.data.bidStatusName ? _data.data.bidStatusName : '领先';
          _tmp.product.bidPrice = _data.data.bidPrice;
          that.currentPrice = _data.data.bidPrice;
          that.product = _tmp;

          that.setBidOn(that.chat_list);
        }

      },
      //最后出价有效果
      setBidOn(_entities) {
        let vue = this;
        let _onId = vue.onId;
        if (_onId > 0) {
          _onId = _entities[_entities.length - 1].id;
        } else {
          for (let _c in _entities) {
            if (_entities[_c].bidStatus > 0) {
              _onId = _entities[_c].id;
              break;
            }
          }
        }
        vue.onId = _onId;
      },
      isEmpty(c){
        if (c === null || c === '' || c === undefined || c === false) return true;
        if (typeof(c) == 'object') {
          for (let x in c) return false;
          return true;
        }
        return false;
      },

      //报名(预交保证金)
      bindDepositTap(){
        let vue = this;
        let _entity = this.product;
        let _postData = { 'goods_id': _entity.id };
        if (_entity.status === 2) {
          vue.$refs.deppost.post(config.auction_signup_url, _postData);

        } else if (_entity.status === 1) {
          vue.msg = '拍卖还未开始';
          vue.showAlert = true;
          vue.close_auto();
        } else if (_entity.status !== 4) {
          vue.msg = '您已报过名了';
          vue.showAlert = true;
          vue.close_auto();
        } else if (_entity.status === 4) {
          vue.msg = '拍卖已经结束了';
          vue.showAlert = true;
          vue.close_auto();
        }
      },
      postSuc(data, item){
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
      //我要出价
      bindSubmitTap: function() {
        let vue = this;
        let _postData = {
          'goods_id': vue.product.id,
          'price': vue.addpri,
        };
        if(vue.addpri<=0){
          console.log('出价不能小于当前最高价！')
          return;
        }
        vue.$refs.subpost.post(config.auction_bid_url, _postData);

      },
      //推送聊天消息
      bindSendTap: function() {
        let that = this;
        if(that.product.token && that.product.token !== '' && that.product.token !== null){
          that.ws.send(that.wsMsg);
          that.wsMsg = '';
        }else {
          location.href = config.loginUrl;
        }
      },
      clear:function () {
        let that = this;
        that.addpri = '';
      }
    },
    components: {
    }
  }
).$mount('#auctiondetail');
