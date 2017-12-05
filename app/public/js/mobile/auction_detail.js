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

let _time_html = '<span :endTime="endTime" :callback="callback" >'+
  '<slot><span class="time-block">{{ time_content.hour }}</span>小时<span class="time-block">{{ time_content.min }}</span>分<span class="time-block">{{ time_content.sec }}</span>秒</slot>' +
  '</span>';
Vue.component('m-time',
  {
    template: _time_html,
    data(){
      return {
        product: config.product,
        time_content: {
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        },
        _sec: 0
      }
    },
    props:{
      endTime:{
        type: Number,
        default :0
      },
      callback : {
        type : Function,
        default :''
      }
    },
    mounted () {
      this.initTime();
      this.countdowm(this._sec);
    },
    methods: {
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
      _countdown(that, t, callback){
        let _temp = {
          d: 0,
          df: 0,
          h: 0,
          hf: 0,
          m: 0,
          s: 0,
        }
        let _countDown = {
          h:0,
          m: 0,
          s: 0,
        }
        let o = setInterval(function () {
          if (t > 0) {
            _temp.d = Math.floor(t / 86400);
            _temp.df = t % 86400;
            _temp.h = Math.floor(_temp.df / 3600);
            _temp.hf = _temp.df % 3600;
            _temp.m = Math.floor(_temp.hf / 60);
            _temp.s = t % 60;
            _countDown.h = _temp.h.toString().length > 1 ? _temp.h : ('0' + _temp.h);
            _countDown.m = _temp.m.toString().length > 1 ? _temp.m : ('0' + _temp.m);
            _countDown.s = _temp.s.toString().length > 1 ? _temp.s : ('0' + _temp.s);
            t = t - 1;
            callback(that, _countDown);
          } else {
            clearInterval(o);
          }
        }, 1000);
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
            self._callback();
          }
        },1000);
      },
      _callback(){
        if(this.callback && this.callback instanceof Function){
          this.callback(...this);
        }
      }
    }
  }
);

let app = new Vue(
  {
    data: {
      product: config.product,
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容,
      open: false,
      docked: false,
      chosen: false,
      swiper: '',
      tops: config.product.images,

      addpri: 0.00,

      wsurl: config.ws_auction_url + '?token=' + config.product.token + '&relation_id=' + config.product.id,

    },
    mounted: function() {
      let vue = this;
      let swiper = this.$refs.swiper;
      if (swiper.dom) {
        this.swiper = swiper.dom;
      }

      if(vue.product.status && parseInt(vue.product.status) === 1){
        //如果是没有开始，不显示聊天
        vue.choose();
      }

    },
    methods: {
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
        vue.addpri = parseFloat(vue.addpri) + parseFloat(vue.product.increasePrice);
      },
      end(){
        console.log('end')
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

      init_ws(){
        let vue = this;
        let _hasFirst = vue.isEmpty(vue.product) ? false : true;

        //已经结束的就不用发起websocket了,第一次请求
        if (vue.product.status !== 4 && !_hasFirst) {
          let socket = new WebSocket(vue.wsurl);
          socket.addEventListener('open', function (event) {
            // socket.send('Hello Server!');
          });
          socket.addEventListener('message', function (event) {
            vue.listenSocket(event)
          });
        }


      },
      listenSocket(res) {
        let that = this;
        if (that.isEmpty(res.data)) return ;

        let _data = JSON.parse(res.data);
        if (_data.code !== 200) {
          that.msg = _data.msg;
          that.showAlert = true;
          that.close_auto();
          return ;
        }
        if (_data.data.roleType === 1) _data.data.bidStatus = 1;
        //加入聊天列表
        let _entities = that.product.chatList;
        _entities.push(_data.data);
        //出价次
        let _entity = that.product;
        _entity.bidCount = _entity.bidCount + 1;

        that.product.chatList = [];
        that.product = {};
        that.product.chatList = _entities;
        that.product = _entity;

        //设置出最高价的用户信息和价格
        if (_data.data.roleType === 1) {
          let _tmp = that.product;
          that.product = {};
          _tmp.product.bidUserHeadPortrait = _data.data.headPortrait;
          _tmp.product.bidUserName = _data.data.userName;
          _tmp.product.bidStatusName = _data.data.bidStatusName ? _data.data.bidStatusName : '领先';
          _tmp.product.bidPrice = _data.data.bidPrice;
          that.product = _tmp;

            that.setBidOn(_entities);
        }
        //自动滚动到最底部
        that.wxScrollBottom();
      },
      isEmpty(c){
        if (c === null || c === '' || c === undefined || c === false) return true;
        if (typeof(c) == 'object') {
          for (let x in c) return false;
          return true;
        }
        return false;
      }

    },
    components: {
    }
  }
).$mount('#auctiondetail');
