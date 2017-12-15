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
        paginationBulletRender: function (swiper, index, className) {
          return '<span class="en-pagination ' + className + '"></span>';
        },
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
Vue.component('overview',
  {
    template: '#overview',
    mounted: function() {
      let vue = this;
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');

      vue.tops = config.product.images;
      let swiper = this.$refs.swiper;
      if (swiper && swiper.dom) {
        this.swiper = swiper.dom;
      }
    },
    activated() {
      if (this.swiper) {
        this.swiper.startAutoplay();
      }
    },
    deactivated() {
      this.loop = false;
      if (this.swiper) {
        this.swiper.stopAutoplay();
      }
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
        pagerloading: false,
        isPage: false,
        nodata: false,

        swiper: '',
        tops: [],
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
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
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
        pagerloading: false,
        isPage: false,
        nodata: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
      },
      loadsingle(index){
        let vue = this;
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
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
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      vue.loadpug();

/*      vue.$nextTick(function() {
       setTimeout(function () {
         document.getElementById('pugHtml').innerHTML = vue.pugsingle.description;
       }, 0)
     });*/

        // console.log(vue.pugsingle.description);
      vue.$nextTick(function() {
        setTimeout(function () {
/*          let i = document.getElementById('pugHtml').querySelectorAll('img');
          let i = document.getElementById('pugHtml').innerHTML;
          Vue.compile(i);
          console.log(i);*/
/*          i.forEach(function(el) {
            // el.setAttribute('v-view', el.getAttribute('vUrl'));
            Vue.compile(el);
          });*/
        }, 500)
      })


    },
    data() {
      return {
        pugs: [],
        pugsingle: {},
        titleshow: false,
        chosen: false,
        pug_num: 0,
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
      loadsingle(index){
        let vue = this;
        tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
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
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      vue.initData();
    },
    data() {
      return {
        tab_service: '',
        listloading: true,
        pagerloading: false,
        isPage: false,
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
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
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
        pagerloading: false,
        isPage: false,
        nodata: false
      }
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
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
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.commentlist = vue.commentlist.concat(data.data.entries);
        vue.pager = data.data.pager;
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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

// let _vText='<img v-view=\"http://localhost:9000/public/img/mobile/resource/pro01.png\" src=\"public/img/mobile/img_loader.gif\" style=\"width: 550px;\">';
// Vue.component('vhtml',{
//   directives: {
//     'view': {
//       inserted: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       bind: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       update: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       componentUpdated: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       }
//     },
//   },
//   props:['hcon'],
//   render: function (createElement) {
//     return createElement(
//       'div',
//       {
//         // DOM 属性
//         domProps: {
//           innerHTML: this.hcon
//         },
// /*        directives: [
//           {
//             name: 'view',
//             value: 'http://localhost:9000/public/img/mobile/resource/pro01.png',
//             // expression: '1 + 1',
//             // arg: '',
//             // modifiers: {
//             //   bar: true
//             // }
//           }
//         ]*/
//       },
//       [
//         createElement('img', {
//           attrs: {
//             id: 'xxxx',
//             src: 'public/img/mobile/img_loader.gif',
//             'v-view': 'http://localhost:9000/public/img/mobile/resource/pro01.png'
//           },
//           directives: [
//             {
//               name: 'view',
//               value: 'http://localhost:9000/public/img/mobile/resource/pro01.png',
//               // expression: '1 + 1',
//               // arg: '',
//               // modifiers: {
//               //   bar: true
//               // }
//             }
//           ],
//         }),
//         createElement('img', {
//           attrs: {
//             id: 'xxxx',
//             src: 'public/img/mobile/img_loader.gif',
//             'v-view': 'http://localhost:9000/public/img/mobile/resource/pro02.png'
//           },
//           directives: [
//             {
//               name: 'view',
//               value: 'http://localhost:9000/public/img/mobile/resource/pro02.png',
//               // expression: '1 + 1',
//               // arg: '',
//               // modifiers: {
//               //   bar: true
//               // }
//             }
//           ],
//         }),
//         createElement('div', {
//             domProps: {
//               innerHTML: _vText
//             },
//             directives: [
//               {
//                 name: 'view',
//                 value: 'http://localhost:9000/public/img/mobile/resource/pro03.png',
//                 // expression: '1 + 1',
//                 // arg: '',
//                 // modifiers: {
//                 //   bar: true
//                 // }
//               }
//             ],
//           }, [])
//       ]
//     )
//   },
//   // template: '<div id="pugHtml">{{ hcon }}</div>',
//   mounted: function() {
//     let vue = this;
//     // console.log(vue.hcon);
//     // document.getElementById('pugHtml').innerHTML = vue.hcon;
// /*    vue.$nextTick(function() {
//       setTimeout(function () {
//         document.getElementById('pugHtml').innerHTML = vue.hcon;
//       }, 0)
//     });*/
//
//   },
//   methods: {
//     click_user(){
//       // console.log('user clicker');
//     }
//   }
// });
//
// Vue.component('vimg',{
//   directives: {
//     'view': {
//       inserted: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       bind: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       update: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       },
//       componentUpdated: (el, binding) => {
//         let resourceEles = {},options = {
//           threshold: -50
//         },initRender;
//         let containerName = binding.arg == undefined ? 'window' : binding.arg
//         if (resourceEles[containerName] == undefined) {
//           resourceEles[containerName] = []
//         }
//         resourceEles[containerName].push({
//           ele: el,
//           src: binding.value
//         });
//         Vue.nextTick(() => {
//           if (typeof initRender == 'undefined') {
//             initRender = _util.debounce(function () {
//               for (let key in resourceEles) {
//                 options.container = key == 'window' ? window : document.getElementById(key);
//                 options.selector = resourceEles[key];
//                 new VueViewload(options).render();
//               }
//             }, 200)
//           }
//           initRender();
//         })
//       }
//     },
//   },
//   props:['vsrc'],
//   render: function (createElement) {
//     return createElement('img', {
//       attrs: {
//         id: 'xxxx',
//         src: 'public/img/mobile/img_loader.gif',
//         'v-view': this.vsrc
//       },
//       directives: [
//         {
//           name: 'view',
//           value: this.vsrc
//           // expression: '1 + 1',
//           // arg: '',
//           // modifiers: {
//           //   bar: true
//           // }
//         }
//       ],
//     })
//   },
//   mounted: function() {
//     let vue = this;
//
//   },
//   methods: {
//   }
// });

let app = new Vue(
  {
    data: {
      product: config.product,
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      // img_url: 'public/img/mobile',
      currentView: 'overview',
      tabs: ['概览', '作者', '泥料', '售后保障', '评论'],
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

      // test_img: '<img v-view="http://localhost:9000/public/img/mobile/resource/pro01.png" src="public/img/mobile/img_loader.gif">'

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
                  vue.close_auto(vue.linkto, data.url);
                }else {
                  vue.showAlert = true;
                  vue.msg = data.message;
                  vue.close_auto(vue.linkto, data.url);
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
