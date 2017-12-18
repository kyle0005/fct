var tools = {
  animate: function (element, target, duration = 400, mode = 'ease-out', callback) {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
      callback = duration;
      duration = 400;
    }else if(duration instanceof String){
      mode = duration;
      duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
      callback = mode;
      mode = 'ease-out';
    }

    //获取dom样式
    var attrStyle = function(attr){
      if (attr === 'opacity') {
        return Math.round(tools.getStyle(element, attr, 'float') * 100);
      } else {
        return tools.getStyle(element, attr);
      }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    var rootSize = parseFloat(document.documentElement.style.fontSize);

    var unit = {};
    var initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
      if (/[^\d^\.]+/gi.test(target[attr])) {
        unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
      }else{
        unit[attr] = 'px';
      }
      initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
      if (unit[attr] == 'rem') {
        target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
      }else{
        target[attr] = parseInt(target[attr]);
      }
    });


    var flag = true; //假设所有运动到达终点
    var remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
      Object.keys(target).forEach(attr => {
        var iSpeed = 0;  //步长
        var status = false; //是否仍需运动
        var iCurrent = attrStyle(attr) || 0; //当前元素属性址
        var speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
        var intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
        switch(mode){
          case 'ease-out':
            speedBase = iCurrent;
            intervalTime = duration*5/400;
            break;
          case 'linear':
            speedBase = initState[attr];
            intervalTime = duration*20/400;
            break;
          case 'ease-in':
            var oldspeed = remberSpeed[attr] || 0;
            iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
            remberSpeed[attr] = iSpeed
            break;
          default:
            speedBase = iCurrent;
            intervalTime = duration*5/400;
        }
        if (mode !== 'ease-in') {
          iSpeed = (target[attr] - speedBase) / intervalTime;
          iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        }
        //判断是否达步长之内的误差距离，如果到达说明到达目标点
        switch(mode){
          case 'ease-out':
            status = iCurrent != target[attr];
            break;
          case 'linear':
            status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
            break;
          case 'ease-in':
            status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
            break;
          default:
            status = iCurrent != target[attr];
        }

        if (status) {
          flag = false;
          //opacity 和 scrollTop 需要特殊处理
          if (attr === 'opacity') {
            element.style.filter = 'alpha(opacity:' + (iCurrent + iSpeed) + ')';
            element.style.opacity = (iCurrent + iSpeed) / 100;
          } else if (attr === 'scrollTop') {
            element.documentElement.scrollTop = iCurrent + iSpeed;
            element.body.scrollTop = iCurrent + iSpeed;
          }else{
            element.style[attr] = iCurrent + iSpeed + 'px';
          }
        } else {
          flag = true;
        }

        if (flag) {
          clearInterval(element.timer);
          if (callback) {
            callback();
          }
        }
      })
    }, 20);
  },
  showBack: function(callback){
    var requestFram;
    var oldScrollTop;

    document.addEventListener('scroll',() => {
      showBackFun();
    }, false)
    document.addEventListener('touchstart',() => {
      showBackFun();
    },{passive: true})

    document.addEventListener('touchmove',() => {
      showBackFun();
    },{passive: true})

    document.addEventListener('touchend',() => {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },{passive: true})

    var moveEnd = function() {
      requestFram = requestAnimationFrame(() => {
        if (document.body.scrollTop != oldScrollTop) {
          oldScrollTop = document.body.scrollTop;
          moveEnd();
        }else{
          cancelAnimationFrame(requestFram);
        }
        showBackFun();
      })
    }

    //判断是否达到目标点
    var showBackFun = function(){
      if (document.body.scrollTop > 500) {
        callback(true);
      }else{
        callback(false);
      }
    }
  },
  loadMore: function(element, callback){
    var windowHeight = window.screen.height;
    var height;
    var setTop;
    var paddingBottom;
    var marginBottom;
    var requestFram;
    var oldScrollTop;

    document.body.addEventListener('scroll',function() {
      loadMore();
    }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
    element.addEventListener('touchstart',function() {
      height = element.offsetHeight;
      setTop = element.offsetTop;
      paddingBottom = tools.getStyle(element,'paddingBottom');
      marginBottom = tools.getStyle(element,'marginBottom');
    },{passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove',function() {
      loadMore();
    },{passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend',function() {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },{passive: true})

    var moveEnd = function() {
      requestFram = requestAnimationFrame(function() {
        if (document.body.scrollTop != oldScrollTop) {
          oldScrollTop = document.body.scrollTop;
          loadMore();
          moveEnd();
        }else{
          cancelAnimationFrame(requestFram);
          //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
          height = element.offsetHeight;
          loadMore();
        }
      })
    }

    var loadMore = function() {
      if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
        callback();
      }
    }
  },
  getStyle: function(element, attr, NumberMode = 'int'){
    var target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
      target = element.documentElement.scrollTop || element.body.scrollTop;
      // target = element.scrollTop;
    }else if(element.currentStyle){
      target = element.currentStyle[attr];
    }else{
      target = document.defaultView.getComputedStyle(element,null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
  },
  getUrlKey:function(name){
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,''])[1].replace(/\+/g,'%20'))||null;
  },
  ajaxGet: function (url, callback, before, error) {
    jAjax({
      type:'get',
      url:url,
      timeOut:5000,
      before:function(){
        if(before){
          before();
        }
      },
      success:function(data){
        if(data){
          data = JSON.parse(data);
          if(parseInt(data.code) == 200 && callback){
            callback(data);
          }else {
            console.log('false')
          }
        }

      },
      error:function(){
        if(error){
          error();
        }
      }
    });
  },
  ajaxPost: function (url, data, callback, before, error, paras, alert) {
    jAjax({
      type:'post',
      url:url,
      data: data || {},
      timeOut:5000,
      before:function(){
        if(before){
          before();
        }
      },
      success:function(data){
        /*
         *
         *  {
         *    "code":200,
         *    "message":null,
         *    "url":"",
         *    "data":
         *           {
         *             "entries": [],
         *             "pager":{"prev":1,"current":"2","next":0,"page_size":10,"total_page":2,"total":15}
         *            }
         *  }
         *
         *  {
         *      "code":404,
         *      "message":"",
         *      "url":null,
         *      "data":{}
         *   }
         *
         *   {
         *      "code":401,
         *      "message":"",
         *      "url":null,
         *      "data":[]
         *   }
         *
         * */
        if(data){
          data = JSON.parse(data);
          if(parseInt(data.code) == 200 && callback){
            callback(data, paras);
          }
          if(data.message && data.message !== null && data.message !== '' && alert){
            alert(data);
          }
          if(data.url){
            location.href = url;
          }

        }
      },
      error:function(status, statusText){
        if(error){
          error();
        }
      }
    });
  },
  getScrollTop: function () {     //滚动条在Y轴上的滚动距离
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
      bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  },
  getScrollHeight: function () {    //文档的总高度
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
      bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  getWindowHeight: function () {      //浏览器视口的高度
    var windowHeight = 0;
    if(document.compatMode == 'CSS1Compat'){
      windowHeight = document.documentElement.clientHeight;
    }else{
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  }
};

function base64_encode(str) {
  var c = 0;
  var buf = [];
  var bits = 0;
  var n = 0;
  if (str.length > 0) {
    while (n < str.length) {
      var code = str.charCodeAt(n++);
      switch (++c) {
        case 1: {
          buf.push(tab[code >> 2]);
          bits = code & 0x3;
          if (n >= str.length) {
            buf.push(tab[bits << 4]);
            buf.push('==');
          }
        } break;
        case 2: {
          buf.push(tab[(code >> 4) | (bits << 4)]);
          bits = code & 0xf;
          if (n >= str.length) {
            buf.push(tab[bits << 2]);
            buf.push('=');
          }
        } break;
        case 3: {
          buf.push(tab[(code >> 6) | (bits << 2)]);
          buf.push(tab[code & 0x3f]);
          bits = 0;
          c = 0;
        } break;
      }
    }
  }
  return buf.join('');
}

//自定义事件构造函数
function EventTarget(){
  //事件处理程序数组集合
  this.handlers = {};
}
//自定义事件的原型对象
EventTarget.prototype = {
  //设置原型构造函数链
  constructor: EventTarget,
  //注册给定类型的事件处理程序，
  //type -> 自定义事件类型， handler -> 自定义事件回调函数
  addEvent: function(type, handler){
    //判断事件处理数组是否有该类型事件
    if(typeof this.handlers[type] == 'undefined'){
      this.handlers[type] = [];
    }
    //将处理事件push到事件处理数组里面
    this.handlers[type].push(handler);
  },
  //触发一个事件
  //event -> 为一个js对象，属性中至少包含type属性，
  //因为类型是必须的，其次可以传一些处理函数需要的其他变量参数。（这也是为什么要传js对象的原因）
  fireEvent: function(event){
    //模拟真实事件的event
    if(!event.target){
      event.target = this;
    }
    //判断是否存在该事件类型
    if(this.handlers[event.type] instanceof Array){
      var handlers = this.handlers[event.type];
      //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
      for(var i = 0; i < handlers.length; i++){
        //执行触发
        handlers[i](event);
      }
    }
  },
  //注销事件
  //type -> 自定义事件类型， handler -> 自定义事件回调函数
  removeEvent: function(type, handler){
    //判断是否存在该事件类型
    if(this.handlers[type] instanceof Array){
      var handlers = this.handlers[type];
      //在同一个事件类型下的可能存在多种处理事件
      for(var i = 0; i < handlers.length; i++){
        //找出本次需要处理的事件下标
        if(handlers[i] == handler){
          break;
        }
      }
      //从事件处理数组里面删除
      handlers.splice(i, 1);
    }
  }
};

var def_target = new EventTarget();

/* lazyload */
let _util = {
  /**
   * debounce 函数去抖
   * @param fn
   * @param delay
   * @returns {function()}
   */
  debounce: function (fn, delay) {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  },
  /**
   * getPicInfo 快速获取图片宽高，图片加载完回调
   * @param options 对象类型，包含{src:string, fastCallback:fn, loadedCallback:fn, errorCallback:fn}
   * @options  src是图片地址，fastCallback是快速获取到图片宽高后的回调函数，loadedCallback是图片加载完的回调函数，errorCallback是图片加载失败的回调函数
   * @params {isError: boolean, width:number: height:number}，回调函数参数
   */
  getPicInfo: function (options) {
    let src = options.src || '',
      fastCallback = options.fastCallback,
      loadedCallback = options.loadedCallback,
      errorCallback = options.errorCallback,
      pic = new Image(),
      params = {
        isError: false,
        width: 0,
        height: 0
      },
      rollpolling = function () {
        if (params.isError || pic.width > 0 || pic.height > 0) {
          clearInterval(timer)
          params.width = pic.width
          params.height = pic.height
          fastCallback && fastCallback(params)
        }
      },
      timer
    pic.src = src
    pic.addEventListener('error', function (e) {
      params.isError = true
      errorCallback && errorCallback(params)
    }, false)
    if (pic.complete) {
      params.width = pic.width
      params.height = pic.height
      fastCallback && fastCallback(params)
      loadedCallback && loadedCallback(params)
    } else {
      pic.addEventListener('load', function () {
        params.width = pic.width
        params.height = pic.height
        loadedCallback && loadedCallback(params)
      }, false)
      timer = setInterval(rollpolling, 50)
    }
  }
};
class VueViewload {
  /**
   * @attr  emptyPic              base64空白图片
   * @param defaultPic            默认加载中图片
   * @param errorPic              加载失败图片
   * @param threshold             距离可视范围偏移值，负值表示提前进入，正值表示延迟进入
   * @param container             容器，必须是id名称，默认为window
   * @param effectFadeIn          是否渐入显示，默认是false
   * @param callback(ele, src)    进入可视区域后的回调函数，接收两个参数：ele表示元素，src表示加载的资源
   * @attr  selector              集合数组[{ele:'', src:''}]，每一项是一个对象，ele表示元素，src表示加载的资源
   * @attr  status                资源加载状态属性值，loading表示还没加载，loaded表示加载完，error表示加载失败
   * @attr  event                 支持的事件
   */
  constructor (options) {
    this.emptyPic = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    this.defaultPic = options && options.defaultPic || this.emptyPic
    this.errorPic = options && options.errorPic || this.emptyPic
    this.container = options && options.container || window
    this.threshold = options && parseInt(options.threshold, 10) || 0
    this.effectFadeIn = options && options.effectFadeIn || false
    this.callback = options && options.callback || new Function
    this.selector = options && options.selector || []
    this.event = ['scroll', 'resize']
    this.status = ['loading', 'loaded', 'error']
    this.delayRender = _util.debounce(this.render.bind(this), 200)
  }

  /**
   * inView 是否进入可视区域
   * @param ele
   * @returns {boolean}
   */
  inView (ele) {
    let isInView = false,
      rect = ele.getBoundingClientRect(),
      parentRect = this.container == window ? {left: 0, top: 0} : this.container.getBoundingClientRect(),
      viewWidth = this.container == window ? window.innerWidth : this.container.clientWidth,
      viewHeight = this.container == window ? window.innerHeight : this.container.clientHeight
    if (rect.bottom > this.threshold + parentRect.top && rect.top + this.threshold < viewHeight + parentRect.top && rect.right > this.threshold + parentRect.left && rect.left + this.threshold < viewWidth + parentRect.left) {
      isInView = true
    }
    return isInView
  }

  /**
   * bindUI 绑定UI事件
   */
  bindUI () {
    this.event.forEach((item, index) => {
      this.container.addEventListener(item, this.delayRender, false)
      if (this.container !== window && item == 'resize') {
        window.addEventListener(item, this.delayRender, false)
      }
    });
    def_target.addEvent('slide', this.delayRender);

  }

  /**
   * unbindUI 删除UI事件
   */
  unbindUI () {
    this.event.forEach((item, index) => {
      this.container.removeEventListener(item, this.delayRender, false)
      if (this.container !== window && item == 'resize') {
        window.removeEventListener(item, this.delayRender, false)
      }
    });
    def_target.removeEvent('slide', this.delayRender);
  }

  /**
   * render 渲染资源
   * data-status属性 值包含：error加载失败，loading加载中，loaded加载完成
   */
  render () {
    if (!this.isLoadEvent) {
      this.isLoadEvent = true
      this.bindUI()
    }
    if (!this.selector.length) {
      this.unbindUI()
    }
    for (let i = 0; i < this.selector.length; i++) {
      let item = this.selector[i],
        eleType = item.ele.nodeName.toLowerCase()
      if (getComputedStyle(item.ele, null).display == 'none') {
        this.selector.splice(i--, 1)
        continue
      }
      if (eleType == 'img') {
        if (!item.ele.getAttribute('data-src')) {
          item.ele.setAttribute('data-src', item.src)
          item.ele.setAttribute('data-status', this.status[0])
        }
        if (!item.ele.getAttribute('src')) {
          item.ele.setAttribute('src', this.defaultPic)
        }
      }
      if (this.inView(item.ele)) {
        if (eleType == 'img') {
          _util.getPicInfo({
            src: item.src,
            errorCallback: (options) => {
              item.ele.src = this.errorPic
              item.ele.setAttribute('data-status', this.status[2])
            },
            loadedCallback: (options) => {
              if (this.effectFadeIn) {
                item.ele.style.opacity = 0
              }
              item.ele.src = options.isError ? this.errorPic : item.src
              item.ele.removeAttribute('data-src')
              item.ele.setAttribute('data-status', this.status[1])
              setTimeout(() => {
                item.ele.style.opacity = 1
                item.ele.style.transition = 'all 1s'
              }, 50)

            }
          })
          this.callback(item.ele, item.src)
        } else {
          typeof item.src == 'function' && item.src.call(item.ele)
        }
        this.selector.splice(i--, 1)
      }
    }
  }
}
Vue.directive('view', {
  inserted(el, binding) {
    let resourceEles = {},options = {
      threshold: -50
    },initRender;
    let containerName = binding.arg == undefined ? 'window' : binding.arg
    if (resourceEles[containerName] == undefined) {
      resourceEles[containerName] = []
    }
    resourceEles[containerName].push({
      ele: el,
      src: binding.value
    });
    Vue.nextTick(() => {
      if (typeof initRender == 'undefined') {
        initRender = _util.debounce(function () {
          for (let key in resourceEles) {
            options.container = key == 'window' ? window : document.getElementById(key);
            options.selector = resourceEles[key];
            new VueViewload(options).render();
          }
        }, 200)
      }
      initRender();
    })
  },
  bind(el, binding) {
    let resourceEles = {},options = {
      threshold: -50
    },initRender;
    let containerName = binding.arg == undefined ? 'window' : binding.arg
    if (resourceEles[containerName] == undefined) {
      resourceEles[containerName] = []
    }
    resourceEles[containerName].push({
      ele: el,
      src: binding.value
    });
    Vue.nextTick(() => {
      if (typeof initRender == 'undefined') {
        initRender = _util.debounce(function () {
          for (let key in resourceEles) {
            options.container = key == 'window' ? window : document.getElementById(key);
            options.selector = resourceEles[key];
            new VueViewload(options).render();
          }
        }, 200)
      }
      initRender();
    })
  },
  update(el, binding){
    let resourceEles = {},options = {
      threshold: -50
    },initRender;
    let containerName = binding.arg == undefined ? 'window' : binding.arg
    if (resourceEles[containerName] == undefined) {
      resourceEles[containerName] = []
    }
    resourceEles[containerName].push({
      ele: el,
      src: binding.value
    });
    Vue.nextTick(() => {
      if (typeof initRender == 'undefined') {
        initRender = _util.debounce(function () {
          for (let key in resourceEles) {
            options.container = key == 'window' ? window : document.getElementById(key);
            options.selector = resourceEles[key];
            new VueViewload(options).render();
          }
        }, 200)
      }
      initRender();
    })
  },
  componentUpdated(el, binding){
    let resourceEles = {},options = {
      threshold: -50
    },initRender;
    let containerName = binding.arg == undefined ? 'window' : binding.arg
    if (resourceEles[containerName] == undefined) {
      resourceEles[containerName] = []
    }
    resourceEles[containerName].push({
      ele: el,
      src: binding.value
    });
    Vue.nextTick(() => {
      if (typeof initRender == 'undefined') {
        initRender = _util.debounce(function () {
          for (let key in resourceEles) {
            options.container = key == 'window' ? window : document.getElementById(key);
            options.selector = resourceEles[key];
            new VueViewload(options).render();
          }
        }, 200)
      }
      initRender();
    })
  }
});
/* lazyload --- end */

/* load-more */
Vue.directive('load-more', {
  bind(el, binding) {
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
    }, false);

    el.addEventListener('touchmove', () => {
      // loadMore();
    }, false);

    el.addEventListener('touchend', () => {
      oldScrollTop = scrollEl.scrollTop;
      // moveEnd();
    }, false);

    window.addEventListener('scroll', () => {
      if (parseFloat(tools.getScrollTop()) + parseFloat(tools.getWindowHeight()) == parseFloat(tools.getScrollHeight())) {
      //  滚动到底部
        moveEnd();
      }
    });


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
      // if (window.pageYOffset + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
        binding.value();
      // }
    }
  }
});
/* load-more end */

/* photo gallery */
let photo_html = '<div class="photogallery-container">' +
  '<transition appear name="v-img-fade">' +
  '<div v-if="!closed" class="fullscreen-v-img" @click.self="close()">' +
  '<div class="header-v-img">' +
  '<span v-if="images.length > 1" class="count-v-img">{{ currentImageIndex + 1 }}/{{ images.length }}</span>' +
  '<span class="close-v-img" @click="close">&times;</span>' +
  '</div>' +
  '<transition appear name="v-img-fade">' +
  '<span v-if="visibleUI && images.length !== 1" class="prev-v-img" @click="prev">' +
  '<svg width="25" height="25" viewBox="0 0 1792 1915" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z" fill="#fff"/></svg>' +
  '</span>' +
  '</transition>' +
  '<transition appear name="v-img-fade">' +
  '<span v-if="visibleUI && images.length !== 1" class="next-v-img" @click="next">' +
  '<svg width="25" height="25" viewBox="0 0 1792 1915" xmlns="http://www.w3.org/2000/svg"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" fill="#fff"/></svg>' +
  '</span>' +
  '</transition>' +
  '<div class="content-v-img">' +
  '<img :src="images[currentImageIndex]" id="img-slide">' +
  '</div>' +
  '</div>' +
  '</transition>' +
  '</div>';
let imgscreen = Vue.extend({
  template: photo_html,
  data() {
    return {
      images: [],
      visibleUI: true,
      currentImageIndex: 0,
      closed: true,
      uiTimeout: null,
    }
  },
  methods: {
    close() {
      document.querySelector('body').classList.remove('body-fs-v-img');
      this.images = [];
      this.currentImageIndex = 0;
      this.closed = true;
    },
    next() {
      // if next index not exists in array of images, set index to first element
      if (this.currentImageIndex + 1 < this.images.length) {
        this.currentImageIndex++;
      } else {
        this.currentImageIndex = 0;
      }
      ;
    },
    prev() {
      // if prev index not exists in array of images, set index to last element
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else {
        this.currentImageIndex = this.images.length - 1;
      }
      ;
    },
    showUI(){
      // UI's hidden, we reveal it for some time only on mouse move and
      // ImageScreen appear
      clearTimeout(this.uiTimeout);
      this.visibleUI = true;
      this.uiTimeout = setTimeout(() => {
        this.visibleUI = false
      }, 3500)
    }
  },
  created() {
    let vue = this;
/*    window.addEventListener('keyup', (e) => {
      // esc key and 'q' for quit
      if (e.keyCode === 27 || e.keyCode === 81) this.close();
      // arrow right and 'l' key (vim-like binding)
      if (e.keyCode === 39 || e.keyCode === 76) this.next();
      // arrow left and 'h' key (vim-like binding)
      if (e.keyCode === 37 || e.keyCode === 72) this.prev();
    });*/
    window.addEventListener('scroll', () => {
      this.close();
    });
    window.addEventListener('mousemove', () => {
      this.showUI();
    });

    let ele = document.querySelector('body');
    let ham = new Hammer(ele);
    ham.on('swipeleft', function(ev) {
      vue.next();
    });
    ham.on('swiperight', function(ev) {
      vue.prev();
    });
  },
});
Vue.directive('img', {
  bind(el, binding) {
    let cursor = 'pointer';
    let src =  '';
    let group = binding.arg || null;
    if (typeof binding.value !== 'undefined') {
      cursor = binding.value.cursor || cursor;
      src = binding.value.exsrc;
      group = binding.value.group || group;
    }

    el.setAttribute('data-vue-img-group', group || null);
    if (binding.value && binding.value.exsrc) {
      el.setAttribute('data-vue-img-src', binding.value.exsrc);
    }

    if (!src) console.error('v-img element missing src parameter.');

    el.style.cursor = cursor;

    let vm = document.vueImg;
    if (!vm) {
      const element = document.createElement('div');
      element.setAttribute('id', 'imageScreen');
      document.querySelector('body').appendChild(element);
      vm = document.vueImg = new imgscreen().$mount('#imageScreen');
    }
    el.addEventListener('click', () => {
      document.querySelector('body').classList.add('body-fs-v-img');
      const images = [
        ...document.querySelectorAll(
          `img[data-vue-img-group="${group}"]`
        ),
      ];
      if (images.length == 0) {
        Vue.set(vm, 'images', [src]);
      } else {
        Vue.set(vm, 'images', images.map(function(currentValue,index,arr){
          return currentValue.dataset.vueImgSrc || currentValue.src;
        }));
        Vue.set(vm, 'currentImageIndex', images.indexOf(el));
      }
      Vue.set(vm, 'closed', false);

    });
  },
});
/* photo gallery --- end */

/* pop */
let pop_html = '<div class="alet_container">' +
  '<section class="tip_text_container">' +
  '<div class="tip_text">{{ msg }}</div>' +
  '</section>' +
  '</div>';
Vue.component('pop',
  {
    template: pop_html,
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

let confirm_html = '<div class="confirm-container">' +
  '<section class="inner">' +
  '<div class="confirm-text">{{ msg }}</div>' +
  '<div class="confirm-btn">' +
  '<a href="javascript:;" class="cancel" @click="no()">取消</a>' +
  '<a href="javascript:;" class="ok" @click="ok()">确定</a>' +
  '</div></section></div>';
Vue.component('confirm',
  {
    template: confirm_html,
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg', 'callback', 'obj'],
    methods: {
      no(){
        this.$emit('no');
      },
      ok(){
        this.$emit('ok', this.callback, this.obj);
      }
    }
  }
);

let post_html = '<span id="post" class="post-container">' +
  '<span class="post-inner" v-if="postProcess">{{ txt }}<span v-if="status">...</span></span>' +
'<span class="post-inner" @click="sub()" v-else>{{ txt }}</span>' +
'</span>';
Vue.component('subpost',
  {
    template: post_html,
    props: {
      txt: {
        type: String,
        default: ''
      },
      status: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        postProcess: false,
      }
    },
    mounted() {
      let vue = this;
    },
    methods: {
      sub(){
        let vue = this;
        vue.$emit('callback');
      },
      post(url, data, paras){
        let vue = this;
        tools.ajaxPost(url, data, vue.success, vue.before, vue.error, paras, vue.alert);
        /*jAjax({
          type:'post',
          url:url,
          data: data,
          timeOut:5000,
          before:function(){
            vue.postProcess = true;
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.$emit('succhandle',data);
              }else {
                vue.$emit('succhandle',data);
              }
            }
            vue.postProcess = false;
          },
          error:function(status, statusText){
            vue.postProcess = false;
          }
        });*/

      },
      before(){
        let vue = this;
        vue.$emit('before');
        vue.postProcess = true;
      },
      success(data, paras){
        let vue = this;
        vue.postProcess = false;
        vue.$emit('success',data, paras);
      },
      error(){
        let vue = this;
        vue.$emit('error');
        vue.postProcess = false;
      },
      alert(data){
        let vue = this;
        vue.$emit('alert',data);
        setTimeout(function () {
          vue.postProcess = false;
        }, 1500);

      }
    }
  }
);

let nodata_html = '<div class="noData">' +
  '<div class="inner">' +
  '<img src="../img/mobile/no_data.png">' +
  '<span class="no">当前没有相关数据哟~</span>' +
'</div>' +
'</div>';
Vue.component('no-data',
  {
    template: nodata_html,
    data(){
      return {}
    },
    mounted() {},
    methods: {}
  }
);

