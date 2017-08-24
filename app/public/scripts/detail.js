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
Vue.component('overview',
  {
    template: '#overview',
    mounted: function() {
      let vue = this;
      tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
    },
    computed: {
      calstock: function () {
        let vue = this;
        let _stock = '无货';
        if(vue.product.stockCount > 0){
          _stock = '有货';
        }
        return _stock;

      }
    },
    data() {
      return {
        product: config.product,
        listloading: true,
        nodata: false
      }
    },
    methods: {
      end(){
        console.log('end')
      }
    },
  }
);
Vue.component('artist',
  {
    template: '#artist',
    mounted: function() {
      let vue = this;
      tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
      vue.loadart();
    },
/*    activated: function () {
      this.listloading = true;
    },*/
    data() {
      return {
        artist: [],
        artistsingle: {},
        titleshow: false,
        chosen: false,
        art_num: 0,
        listloading: true,
        nodata: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
      },
      loadsingle(index){
        let vue = this;
        tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
        vue.artistsingle = {};
        vue.art_num = index;
        vue.artistsingle = vue.artist[index];
        vue.listloading = false;
      },
      loadart() {
        let vue = this;
        tools.ajaxGet(config.artist_url, vue.getSucc, vue.getBefore);
      },
      getSucc(data){
        let vue = this;
        vue.artist = data.data;
        vue.titleshow = vue.artist.length > 1;
        vue.loadsingle(0);
      }
    },
  }
);
Vue.component('pug',
  {
    template: '#pug',
    mounted: function() {
      let vue = this;
      tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
      vue.loadpug();
    },
    data() {
      return {
        pugs: [],
        pugsingle: {},
        titleshow: false,
        chosen: false,
        pug_num: 0,
        listloading: true,
        nodata: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      loadsingle(index){
        let vue = this;
        tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
        vue.pugsingle = {};
        vue.pug_num = index;
        vue.pugsingle = vue.pugs[index];
      },
      loadpug() {
        let vue = this;
        tools.ajaxGet(config.pug_url, vue.pugSucc, vue.getBefore);
      },
      pugSucc(data){
        let vue =this;
        vue.pugs = data.data;
        vue.titleshow = vue.pugs.length > 1;
        vue.loadsingle(0);
        vue.listloading = false;
      }
    },
  }
);
Vue.component('service',
  {
    template: '#service',
    mounted: function() {
      let vue = this;
      tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
      vue.initData();
    },
    data() {
      return {
        tab_service: '',
        listloading: true,
        nodata: false
      }
    },
    methods: {
      initData(){
        let vue = this;
        vue.tab_service = config.tab_service;
        vue.listloading = false;
      },
    },
  }
);
Vue.component('discuss',
  {
    template: '#discuss',
    mounted: function() {
      let vue = this;
      tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
      vue.loadList();
    },
    watch: {
      commentlist: function (val, oldVal) {
        if(!this.listloading){
          if(this.commentlist && this.commentlist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data() {
      return {
        pager: {},
        commentlist: [],
        preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
        last_url: '',
        listloading: true,
        nodata: false
      }
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
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      c_star(num){
        let vue = this;
        return (5 - num);
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.discuss_url + '?page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.commentlist = data.data.entries.concat(vue.commentlist);
        vue.pager = data.data.pager;
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
      },
      loadList() {
        let vue = this;
        vue.nodata = false;
        tools.ajaxGet(config.discuss_url, vue.listSucc, vue.getBefore);
      },
      listSucc(data){
        let vue = this;
        vue.commentlist = data.data.entries;
        vue.pager = data.data.pager;
        vue.listloading = false;
      }
    },
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
      img_url: 'public/images',
      currentView: 'overview',
      tabs: ['概览', '艺人', '泥料', '售后保障', '评论'],
      tab_num: 0,
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

      subText: '加入购物车'

    },
    mounted: function() {
      let vue = this;
      vue.loadcart();
      vue.specs_single = vue.product.specification[0];
    },
    computed: {
      calstock: function () {
        let vue = this;
        let _stock = 0;
        if(vue.product.specification.length <= 0){
          if(vue.product.stockCount > 0){
            _stock = '有货';
          }
        }else {
          // vue.specs_single = vue.product.specification[0];
          if(vue.specs_single.stockCount > 0){
            _stock = '有货';
          }
        }

        return _stock;
      },
      showprice: function () {
        let vue = this, _price = 0;
        if(vue.product.specification.length <= 0){
          // _price = vue.product.salePrice;
          _price = (vue.product.hasDiscount && (vue.product.discount.hasBegin || vue.product.discount.canBuy))
          ? vue.product.promotionPrice : vue.product.salePrice;
        }else {
          // vue.specs_single = vue.product.specification[0];
          _price = (vue.product.hasDiscount && (vue.product.discount.hasBegin || vue.product.discount.canBuy))
            ? vue.specs_single.promotionPrice : vue.specs_single.salePrice;
          // _price = vue.specs_single.salePrice;
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
        tools.animate(document.body, {scrollTop: '0'}, 400,'ease-out');
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
         /* jAjax({
            type:'post',
            url:config.addcart_url,
            data: formData.serializeForm('addcart'),
            timeOut:5000,
            before:function(){
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                if(parseInt(data.code) == 200){
                  vue.cart_num = data.data.cartProductCount;
                  vue.loadcart();
                  vue.msg = data.message;
                  vue.showAlert = true;
                  vue.close_auto();

                }else {
                  vue.msg = data.message;
                  vue.showAlert = true;
                  vue.close_auto();
                }
              }

            },
            error:function(status, statusText){
            }
          });*/
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
).$mount('#detail');
