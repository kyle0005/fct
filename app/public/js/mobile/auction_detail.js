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
  '<slot><span class="time-block">{{ time_content.hour }}</span>:<span class="time-block">{{ time_content.min }}</span>:<span class="time-block">{{ time_content.sec }}</span></slot>' +
  '</span>';
Vue.component('m-time',
  {
    template: _time_html,
    data(){
      return {
        time_content: {
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        },
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
      this.countdowm(this.endTime)
    },
    methods: {
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
      currentView: 'overview',
      showAlert: false, //显示提示组件
      msg: null, //提示的内容,
      open: false,
      docked: false,
      chosen: false,
      input_val: 1,
      specs_single: [],
      specs_num: 0,
      min: false,   /* 产品数量最小值 */
      max: false,   /* 产品数量最大值 */
      collected: config.product.favoriteState,
      numsshow: false,
      isbuy:false,
      cart_num: config.product.cartProductCount,

      subText: '加入购物车',

      swiper: '',
      tops: config.product.images,


    },
    mounted: function() {
      let vue = this;
      let swiper = this.$refs.swiper;
      if (swiper.dom) {
        this.swiper = swiper.dom;
      }
      vue.loadcart();
      vue.specs_single = vue.product.specification[0];
    },
    computed: {
/*      calstock: function () {
        let vue = this;
        let _stock = 0;
        if(vue.product.specification.length <= 0){
          if(vue.product.stockCount > 0){
            _stock = '有货';
          }
        }else {
          if(vue.specs_single.stockCount > 0){
            _stock = '有货';
          }
        }

        return _stock;
      },*/
      calstock: function () {
        let vue = this;
        let _stock = '无货';
        if(vue.product.stockCount > 0){
          _stock = '有货';
        }
        return _stock;

      },
      showprice: function () {
        let vue = this, _price = 0;
        if(vue.product.specification.length <= 0){
          _price = (vue.product.hasDiscount && (vue.product.discount.hasBegin || vue.product.discount.canBuy))
            ? vue.product.promotionPrice : vue.product.salePrice;
        }else {
          _price = (vue.product.hasDiscount && (vue.product.discount.hasBegin || vue.product.discount.canBuy))
            ? vue.specs_single.promotionPrice : vue.specs_single.salePrice;
        }
        return _price;

      }
    },
    methods: {
      loadcart(){
        let vue = this;
        let _num = vue.cart_num;
        if(_num > 0){
          vue.numsshow = true;
        }else {
          vue.numsshow = false;
        }
      },
      top(){
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      },
      collection(){
        let vue = this;
        jAjax({
          type:'post',
          url:config.fav_url,
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            //{message:"xxx", url:"", code:200, data:""}
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.collected = data.data.favoriteState;
                if(vue.collected){
                  vue.showAlert = true;
                  vue.msg = data.message;
                  vue.close_auto();
                }else {
                  vue.showAlert = true;
                  vue.msg = data.message;
                  vue.close_auto();
                }
              }
            }

          },
          error:function(){
          }
        });
      },
      change(index) {},
      add(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        let _stock = 0;
        _stock = (vue.product.specification.length <= 0) ? vue.product.stockCount: vue.specs_single.stockCount;
        if(vue.min){
          vue.min = false;
        }
        if(num < _stock){
          num += 1;
          if(num === _stock){
            vue.max = true;
          }
        }
        vue.input_val = num;
      },
      minus(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(vue.max){
          vue.max = false;
        }
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          vue.input_val = num;
        }
      },
      footLinkTo(index){
        let vue = this;
        vue.specs_num = index;
        vue.specs_single = vue.product.specification[index];
        vue.input_val = 1;
        vue.min = false;
        vue.max = false;
      },
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
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
      chooseSpec(){
        let vue = this;
        if(!vue.chosen) {
          vue.chosen = true;
        }
        else {
          vue.chosen = false;
        }
      },
      buy(num){
        let vue = this;
        if(parseInt(num) == 1){
          //  立即购买
          let _url = config.buy_url + '?product_id=' + vue.product.id;
          if(vue.specs_single && vue.specs_single.id){
            _url += '&spec_id=' + vue.specs_single.id;
          }
          _url += '&buy_number=' + vue.input_val;
          location.href = _url;
        }else {
          //  加入购物车
          let post_url = config.addcart_url,
            post_data = formData.serializeForm('addcart');
          vue.$refs.subpost.post(post_url, post_data);
        }

      },
      linkTo(num){
        let vue = this;
        vue.tab_num = num;
        switch(parseInt(num))
        {
          case 0:
            vue.currentView ='overview';
            break;
          case 1:
            vue.currentView ='artist';
            break;
          case 2:
            vue.currentView ='pug';
            break;
          case 3:
            vue.currentView ='service';
            break;
          case 4:
            vue.currentView ='discuss';
            break;
          default:
            vue.currentView ='overview';
        }

      },
      end(){
        console.log('end')
      },
      succhandle(data){
        let vue = this;
        vue.cart_num = data.data.cartProductCount;
        vue.loadcart();
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
    components: {
    }
  }
).$mount('#auctiondetail');
