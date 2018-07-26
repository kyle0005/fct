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
  ajaxPost: function (url, data, callback, before, error, paras, alert, upload) {
    let _timeout = 5000;
    if(!upload){
      _timeout = 60000;
    }
    jAjax({
      type:'post',
      url:url,
      data: data || {},
      timeOut:_timeout,
      contentType: upload,    /* 如果是上传文件，为false，否则, 为undefined */
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
            location.href = data.url;
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
  },
  imgCompress: function (file, callback) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image();

    if (window.FileReader) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      //监听文件读取结束后事件
      reader.onload = function (e) {
        img.src = e.target.result;
      };
    }
    img.onload = function () {
      // 图片原始尺寸
      let originWidth = this.width;
      let originHeight = this.height;
      // 最大尺寸限制
      let maxWidth = 750, maxHeight = 750;
      // 目标尺寸
      let targetWidth = originWidth, targetHeight = originHeight;
      // 图片尺寸超过400x400的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }

      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      // canvas转为blob并上传
      canvas.toBlob(function (blob) {
        if(callback){
          callback(blob, file.name)
        }
      }, file.type || 'image/png', 0.9);
    };

  },

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
  '<div class="inner">' +
  '<div class="confirm-con">' +
  '<div class="confirm-title" v-if="title">{{ title }}</div>' +
  '<div class="confirm-text" v-if="msg">{{ msg }}</div>' +
  '</div><div class="confirm-btn">' +
  '<a href="javascript:;" class="cancel" @click="no()">{{ notxt }}</a>' +
  '<a href="javascript:;" class="ok" @click="ok()">{{ oktxt }}</a>' +
  '</div></div></div>';
Vue.component('confirm',
  {
    template: confirm_html,
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    // props: ['title','msg', 'callback', 'obj'],
    props: {
      title: {
        type: String,
        default: '您确认要执行此操作？'
      },
      msg: {
        type: String,
        default: ''
      },
      callback: {
        type: Function,
        default: null
      },
      obj: {
        type: Object,
        default: null
      },
      notxt: {
        type: String,
        default: '取消'
      },
      oktxt: {
        type: String,
        default: '确认'
      },

},
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
        vue.postProcess = true;
        if(paras && paras.delaynum){    /* 如果有延迟请求参数 */
          setTimeout(function (){
            tools.ajaxPost(url, data, vue.success, vue.before, vue.error, paras, vue.alert);
          }, paras.delaynum);
        }else {
            tools.ajaxPost(url, data, vue.success, vue.before, vue.error, paras, vue.alert);
        }


      },
      before(){
        let vue = this;
        vue.$emit('before');
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
  '<img :src="imgurl">' +
  '<span class="no">{{ text }}</span>' +
'</div>' +
'</div>';
Vue.component('no-data',
  {
    template: nodata_html,
    data(){
      return {}
    },
    props: {
      imgurl: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      }
    },
    mounted() {},
    methods: {}
  }
);

/* 图片放大预览 */
(function( global, factory ) {
  //For CommonJS and CommonJS-like
  if ( typeof module === 'object' && typeof module.exports === 'object' ) {
    module.exports = global.document ?
      factory( global, true ) :
      function( w ) {
        if ( !w.document ) {
          throw new Error( 'previewImage requires a window with a document' );
        }
        return factory( w );
      };
  } else {
    factory( global );
  }

// Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function(window){
  var $ = {};
  var style = '#__previewImage-container{-ms-touch-action:none;touch-action:none;-webkit-touch-action:none;line-height:100vh;background-color:#000;width:100vw;height:100vh;position:fixed;overflow:hidden;top:0;left:0;z-index: 2147483647;transition:transform .3s;-ms-transition:transform .3s;-moz-transition:transform .3s;-webkit-transition:transform .3s;-o-transition:transform .3s;transform:translate3d(100%,0,0);-webkit-transform:translate3d(100%,0,0);-ms-transform:translate3d(100%,0,0);-o-transform:translate3d(100%,0,0);-moz-transform:translate3d(100%,0,0)}#__previewImage-container .previewImage-text{position:absolute;top:.6em;text-align:center;font-size:18px;line-height:25px;color:#fff;z-index:10;padding: 0.2em 0.4em;background-color: rgba(255,255,255,0.4);border-radius: 50%;letter-spacing: 0;right:.8em}#__previewImage-container .previewImage-text .previewImage-text-index{font-size: 24px;}#__previewImage-container .previewImage-box{width:999999rem;height:100vh}#__previewImage-container .previewImage-box .previewImage-item{width:100vw;height:100vh;margin-right:15px;float:left;text-align:center;background:url(http://static.luyanghui.com/svg/oval.svg) no-repeat center/auto}#__previewImage-container .previewImage-box .previewImage-item.previewImage-nobackground{background:none}#__previewImage-container .previewImage-box .previewImage-item .previewImage-image{vertical-align:middle;width:100%}';
  $.isArray = function(value) {
    return Object.prototype.toString.call(value) == '[object Array]';
  }
  /**
   * get multiple elements
   * @public
   */
  $.all = function(selector, contextElement) {
    var nodeList,
      list = [];
    if (contextElement) {
      nodeList = contextElement.querySelectorAll(selector);
    } else {
      nodeList = document.querySelectorAll(selector);
    }
    if (nodeList && nodeList.length > 0) {
      list = Array.prototype.slice.call(nodeList);
    }
    return list;
  }

  /**
   * delegate an event to a parent element
   * @public
   * @param  array     $el        parent element
   * @param  string    eventType  name of the event
   * @param  string    selector   target's selector
   * @param  function  fn
   */
  $.delegate = function($el, eventType, selector, fn) {
    if (!$el) { return; }
    $el.addEventListener(eventType, function(e) {
      var targets = $.all(selector, $el);
      if (!targets) {
        return;
      }
      for (var i=0; i<targets.length; i++) {
        var $node = e.target;
        while ($node) {
          if ($node == targets[i]) {
            fn.call($node, e);
            break;
          }
          $node = $node.parentNode;
          if ($node == $el) {
            break;
          }
        }
      }
    }, false);
  };
  var _previewImage = function(){
    this.winw = window.innerWidth||document.body.clientWidth;  //窗口的宽度
    this.winh = window.innerHeight||document.body.clientHeight; //窗口的高度
    this.originWinw = this.winw;    //存储源窗口的宽度
    this.originWinh = this.winh;    //存储源窗口的高度
    this.marginRight = 15;  //图片之间的间隔->previewImage-item的margin-right
    this.imageChageMoveX = this.marginRight+this.winw;  //图片切换容器的x位移量
    this.imageChageNeedX = Math.floor(this.winw*(0.5)); //图片切换所需x位移量
    this.cssprefix = ['','webkit','Moz','ms','o']; //css前缀
    this.version = '1.0.3'; //版本号
    this.imgLoadCache = new Object();  //图片加载状态储存 key=md5(img.src),value={isload:true,elem:img};
    this.scale = 1;     //默认图片放大倍数
    this.maxScale = 4;  //图片默认最大放大倍数
    this.maxOverScale = 6;  //图片放大倍数最大可达到
    // this.minScale = 0.5; //图片最小可放大倍数
    this.openTime = 0.3;    //打开图片浏览动画时间
    this.slipTime = 0.5;    //图片切换时间
    this.maxOverWidthPercent = 0.5; //边界图片最大可拉取宽度，屏幕宽度的百分比
    this.$box = false;  //图片容器加载状态
    this.isPreview = false; //是否正在预览图片
    var $style = document.createElement('style');   //样式标签
    $style.innerText = style;   //加载样式
    $style.type = 'text/css';
    this.$container = document.createElement('div');    //加载容器
    this.$container.id = '__previewImage-container';    //容器加上id
    this.$container.style.width = this.winw+'px';   //加上宽度
    this.$container.style.height = this.winh+'px';  //加上高度
    document.body.appendChild(this.$container);     //插入容器到body
    document.head.appendChild($style);              //插入样式到head
    this.bind();    //绑定事件
  }
  _previewImage.prototype.start = function(obj){  //可优化 todo
    var urls = obj.urls;    //待预览的图片列表
    var current = obj.current;  //当前预览的图片地址

    this.$container.innerHTML = ''; //清空容器
    if(!urls||!$.isArray(urls)||urls.length==0){    //参数检测
      throw new Error('urls must be a Array and the minimum length more than zero');
      return
    }
    if(!current){   //参数检测
      this.index = 0;
      console.warn('current is empty,it will be the first value of urls!');
    }else{
      var index = urls.indexOf(current);
      if(index<0){
        index = 0;
        console.warn('current isnot on urls,it will be the first value of urls!');
      }
      this.index = index; //当前图片序号
    }
    this.urls = urls;   //所有图片url列表
    this.maxLen = urls.length-1;  //最大图片数 0<=index<=maxLen
    this.cIndex = this.maxLen+1;    //containerIndex
    this.bIndex = this.maxLen+2;    //boxIndex
    this.imgStatusCache = new Object(); //图片信息储存
    this.render();                //渲染预览模块
  }

  _previewImage.prototype.render = function(){
    var _this = this;
    if(this.$box===false){  //加载图片容器
      var box = document.createElement('div');
      box.className += 'previewImage-box';
      this.$box = box; //更新图片容器
    }else{
      this.$box.innerHTML = '';  //已有图片容器-清空容器
    }
    var text = document.createElement('div');   //当前张数/总张数--文本标签
    this.$text = text;
    this.$text.className += 'previewImage-text';
    this.$text.innerHTML = '<span class="previewImage-text-index">'+(this.index+1)+'/</span>'+(this.maxLen+1);    //当前第几张/图片总数
    this.container = this.imgStatusCache[this.cIndex] = {elem:this.$container,x:this.winw,y:0,m:0,my:0,scale:1,scalem:1}; //存储容器状态
    this.box = this.imgStatusCache[this.bIndex] = {elem:this.$box,x:0,y:0,m:0,my:0,scale:1,scalem:1};   //存储图片容器状态
    this.urls.forEach(function(v,i){    //图片
      var div = document.createElement('div');
      var hash = window.md5?md5(v+i):v+i;
      var img;
      var imgCache = _this.imgLoadCache[hash];
      //缓存图片&&读取缓存图片
      if(imgCache&&imgCache.isload){    //图片已加载--使用缓存
        img = imgCache.elem;
        div.className+=' previewImage-nobackground';
      }else{  //图片未加载--加载图片，加入缓存
        img = new Image();
        img.className += 'previewImage-image';
        _this.imgLoadCache[hash] = {isload:false,elem:img};
        if(i == _this.index){   //将当前需要预览的图片加载
          img.src = v;
          img.onload = function(){
            div.className+=' previewImage-nobackground';
            _this.imgLoadCache[hash].isload = true;
          }
        }
      }
      _this.imgStatusCache[i] = {hash:hash,x:0,m:0,y:0,my:0,scale:_this.scale,scalem:1};  //修改缓存状态
      // img.setAttribute('data-index',i);  //未使用
      div.className+=' previewImage-item';
      div.appendChild(img);
      _this.$box.appendChild(div); //将图片div加入 图片容器
    })

    this.$container.appendChild(this.$box);    //加载图片容器
    this.$container.appendChild(this.$text);    //加载图片张数提示
    var offsetX = -this.imageChageMoveX*this.index;  //计算显示当前图片，容器所需偏移量
    this.box.x = offsetX;   //将图片容器所需偏移量，存入状态缓存器
    this.container.x = 0;   //显示预览模块
    this.$container.style.display = 'block';
    setTimeout(function(){
      _this.translateScale(_this.bIndex,0);
      _this.translateScale(_this.cIndex,_this.openTime);
      _this.isPreview = true;
    },50);
  }

  _previewImage.prototype.bind = function(){
    var $container = this.$container;
    var _this = this;
    var closePreview = function(){
      _this.closePreview.call(_this);
    }
    var touchStartFun = function(){
      _this.touchStartFun.call(_this);
    }
    var touchMoveFun = function(){
      _this.touchMoveFun.call(_this);
    }
    var touchEndFun = function(){
      _this.touchEndFun.call(_this);
    }

    // var orientationChangeFun = function(){
    //     var angle = screen.orientation.angle;
    //     var _this = this;
    //     if(angle==90||angle==180){
    //         _this.winw = _this.originWinh;
    //         _this.winh = _this.originWinw;
    //     }else{
    //         _this.winw = _this.originWinw;
    //         _this.winh = _this.originWinh;
    //     }
    //     _this.$container.style.width = _this.winw+'px';   //改变宽度
    //     _this.$container.style.height = _this.winh+'px';  //改变高度
    //     _this.imageChageMoveX = _this.marginRight+_this.winw;
    //     var offsetX = -_this.imageChageMoveX*_this.index;  //计算显示当前图片，容器所需偏移量
    //     try{
    //         _this.box.x = offsetX;   //将图片容器所需偏移量，存入状态缓存器
    //         _this.translateScale(_this.bIndex,0);
    //     }catch(e){}
    // }.bind(this);

    var reSizeFun = function(){
      var _this = this;
      _this.winw = window.innerWidth||document.body.clientWidth;  //窗口的宽度
      _this.winh = window.innerHeight||document.body.clientHeight; //窗口的高度
      _this.originWinw = _this.winw;    //存储源窗口的宽度
      _this.originWinh = _this.winh;    //存储源窗口的高度
      _this.$container.style.width = _this.winw+'px';   //改变宽度
      _this.$container.style.height = _this.winh+'px';  //改变高度
      _this.imageChageMoveX = _this.marginRight+_this.winw;
      var offsetX = -_this.imageChageMoveX*_this.index;  //计算显示当前图片，容器所需偏移量
      try{
        _this.box.x = offsetX;   //将图片容器所需偏移量，存入状态缓存器
        _this.translateScale(_this.bIndex,0);
      }catch(e){}
    }.bind(this);

    // window.addEventListener('orientationchange',orientationChangeFun,false);
    window.addEventListener('resize',reSizeFun,false);
    $.delegate($container,'click','.previewImage-item',closePreview);
    $.delegate($container,'touchstart','.previewImage-item',touchStartFun);
    $.delegate($container,'touchmove','.previewImage-item',touchMoveFun);
    $.delegate($container,'touchend','.previewImage-item',touchEndFun);
    $.delegate($container,'touchcancel','.previewImage-item',touchEndFun);
  }

  _previewImage.prototype.closePreview = function(){
    var _this = this;
    this.imgStatusCache[this.cIndex].x = this.winw;
    this.translateScale(this.cIndex,this.openTime);
    this.imgStatusRewrite();
    this.translateScale(this.index,this.slipTime);
    setTimeout(function(){
      _this.$container.style.display = 'none';
    },this.slipTime*1000);
    _this.isPreview = false;
  }

  _previewImage.prototype.touchStartFun = function(imgitem){
    this.ts = this.getTouches();
    this.allowMove = true;  //行为标记
    this.statusX = 0; //标记X轴位移状态
    this.statusY = 0; //标记Y轴位移状态
  }

  _previewImage.prototype.touchMoveFun = function(imgitem){
    this.tm = this.getTouches();
    var tm = this.tm;
    var ts = this.ts;
    this.moveAction(ts,tm);
  }

  _previewImage.prototype.touchEndFun = function(imgitem){
    var $container = this.$container;
    this.te = this.getTouches();
    this.endAction(this.ts,this.te);
  }

  _previewImage.prototype.moveAction = function(ts,tm){
    if(!this.allowMove){
      return
    }
    var imgStatus = this.getIndexImage();
    var maxWidth = this.winw*0.3/imgStatus.scale;
    var x0_offset = tm.x0 - ts.x0;
    var y0_offset = tm.y0 - ts.y0;
    if(Math.abs(y0_offset)>0){  //阻止Ios系统的浏览器环境上下滑动
      event.preventDefault();
    }
    var imgPositionX = imgStatus.x+x0_offset;
    var imgPositionY = imgStatus.y+y0_offset;
    var allow = this.getAllow(this.index);
    var allowX = this.allowX = allow.x;
    var allowY = this.allowY = allow.y0;
    if(x0_offset<=0){  //边界
      this.allowX = -allowX;
    }
    if(y0_offset<=0){   //边界
      allowY = this.allowY = allow.y1;
    }
    if(tm.length==1){   //单手指(图片位移)
      if(imgStatus.scale>1){
        //Y方向位移
        if(imgPositionY>=allow.y0){  //超过窗口上边界
          this.statusY = 1;
          var overY = imgPositionY - allow.y0;
          imgStatus.my = allow.y0-imgStatus.y+this.getSlowlyNum(overY,maxWidth);
        }else if(imgPositionY<=allow.y1){ //超过窗口下边界
          this.statusY = 1;
          var overY = imgPositionY - allow.y1;
          imgStatus.my = allow.y1-imgStatus.y+this.getSlowlyNum(overY,maxWidth);
        }else{
          this.statusY = 2;
          imgStatus.my = y0_offset;
        }

        //X方向位移
        if(x0_offset<0&&imgStatus.x<=-allowX){ //左滑->初始状态到达或超过右边界->图片平滑移动到达条件-切换下一张
          this.statusX = 1;
          this.box.m = x0_offset; //更新位移信息
          if(this.index==this.maxLen){ //box到达右边界
            this.box.m = this.getSlowlyNum(x0_offset);  //阻尼效果
          }
          this.translateScale(this.bIndex,0);
          this.translateScale(this.index,0);
        }else if(x0_offset>0&&imgStatus.x>=allowX){    //右滑->初始状态到达或超过左边界->图片平滑移动到达条件-切换上一张
          this.statusX = 2;
          this.box.m = x0_offset;
          if(this.index==0){ //box到达左边界
            this.box.m = this.getSlowlyNum(x0_offset);  //阻尼效果
          }
          this.translateScale(this.bIndex,0);
          this.translateScale(this.index,0);
        }else{  //初始状态未到边界->图片平滑移动到边界->阻尼移动
          if(x0_offset==0){
            return
          }
          this.statusX = 3;
          imgStatus.m = x0_offset;
          if(imgPositionX>=allowX){   //右滑到达左边界
            this.statusX = 4;
            var overX = imgPositionX - allowX;
            imgStatus.m = allowX-imgStatus.x+this.getSlowlyNum(overX,maxWidth);
          }
          if(imgPositionX<=-allowX){  //左滑到达右边界
            this.statusX = 4;
            var overX = imgPositionX + allowX;
            imgStatus.m = -allowX-imgStatus.x+this.getSlowlyNum(overX,maxWidth);
          }
          this.translateScale(this.index,0);
        }
      }else{  //scale == 1;
        if(Math.abs(y0_offset)>5&&this.statusX != 5){  //长图片处理
          var $img = this.getJqElem(this.index);
          var imgBottom = $img.height-this.winh;
          if(y0_offset>0&&imgPositionY>0){
            this.statusX = 7;
            this.allowY = 0;
            imgStatus.my = - imgStatus.y + this.getSlowlyNum(imgPositionY,maxWidth);
          }else if(y0_offset<0&&imgPositionY<-imgBottom){
            this.statusX = 7;
            if($img.height>this.winh){
              var overY = imgPositionY + imgBottom;
              this.allowY = -imgBottom;
              imgStatus.my = -imgBottom - imgStatus.y + this.getSlowlyNum(overY,maxWidth);
            }else{
              this.allowY = 0;
              imgStatus.my = - imgStatus.y + this.getSlowlyNum(imgPositionY,maxWidth);
            }
          }else{

            this.statusX = 6;
            imgStatus.my = y0_offset;
          }
          this.translateScale(this.index,0);
        }else{
          if(this.statusX == 6){
            return
          }
          this.statusX = 5;
          if((this.index==0&&x0_offset>0)||(this.index==this.maxLen&&x0_offset<0)){ //box到达左右边界
            this.box.m = this.getSlowlyNum(x0_offset);
          }else{
            this.box.m = x0_offset;
          }
          this.translateScale(this.bIndex,0);
        }
      }
    }else{  //多手指(图片放大缩小)
      var scalem = this.getScale(ts,tm)
      var scale = scalem*imgStatus.scale;
      if(scale>=this.maxScale){  //达到最大放大倍数
        var over = scale - this.maxScale;
        scale = this.maxScale+this.getSlowlyNum(over,this.maxOverScale);
        scalem = scale/imgStatus.scale;
      }
      imgStatus.scalem = scalem;
      this.translateScale(this.index,0);
    }
  }

  _previewImage.prototype.endAction = function(ts,te){
    var imgStatus = this.getIndexImage();
    var x0_offset = te.x0 - ts.x0;
    var y0_offset = te.y0 - ts.y0;
    var time = te.time - ts.time;
    var slipTime = 0;
    this.allowMove = false; //结束所有行为
    if(ts.length==1){      //单手指(图片位移)
      if(Math.abs(x0_offset)>10){ //防止误触关闭看图
        event.preventDefault();
      }
      switch(this.statusY){
        case 1:
          imgStatus.y = this.allowY;
          imgStatus.my = 0;
          slipTime = this.slipTime;
          break
        case 2:
          imgStatus.y = imgStatus.y+imgStatus.my;
          imgStatus.my = 0;
          break
      }

      switch(this.statusX){
        case 1: //左滑->初始状态到达或超过右边界->图片平滑移动到达条件-切换下一图
          if(this.index!=this.maxLen&&(x0_offset<=-this.imageChageNeedX||(time<200&&x0_offset<-30))){    //下一图
            this.changeIndex(1);
          }else{
            this.changeIndex(0);
            if(slipTime!=0){
              this.translateScale(this.index,slipTime);
            }
          }
          break
        case 2: //右滑->初始状态到达或超过左边界->图片平滑移动到达条件-切换上一图
          if(this.index!=0&&(x0_offset>=this.imageChageNeedX||(time<200&&x0_offset>30))){ //上一图
            this.changeIndex(-1);
          }else{
            this.changeIndex(0);
            if(slipTime!=0){
              this.translateScale(this.index,slipTime);
            }
          }
          break
        case 3: //scale>1,初始状态未到边界->图片平滑移动未到边界
          imgStatus.x = imgStatus.x+imgStatus.m;
          imgStatus.m = 0;
          this.translateScale(this.index,slipTime);
          break
        case 4: //scale>1,初始状态未到边界->图片平滑移动到边界->阻尼移动
          imgStatus.x = this.allowX;
          imgStatus.m = 0;
          slipTime = this.slipTime;
          this.translateScale(this.index,slipTime);
          break
        case 5: //scale=1,box位移，图片切换
          if(x0_offset>=this.imageChageNeedX||(time<200&&x0_offset>30)){    //上一图
            this.changeIndex(-1);
          }else if(x0_offset<=-this.imageChageNeedX||(time<200&&x0_offset<-30)){ //下一图
            this.changeIndex(1);
          }else{
            this.changeIndex(0);
          }
          break
        case 6: //scale=1,长图片
          imgStatus.y = imgStatus.y+imgStatus.my;
          imgStatus.my = 0;
          break
        case 7: //scale=1,长图片 到边界
          imgStatus.y = this.allowY;
          imgStatus.my = 0;
          this.translateScale(this.index,this.slipTime);
          break
      }
    }else{  // 放大倍数问题
      event.preventDefault();

      var scale = imgStatus.scale*imgStatus.scalem;
      var $img = this.getJqElem(this.index);
      imgStatus.scale = scale;
      var allow = this.getAllow(this.index);

      if(imgStatus.x>allow.x){
        slipTime = this.slipTime;
        imgStatus.x = allow.x;
      }else if(imgStatus.x<-allow.x){
        slipTime = this.slipTime;
        imgStatus.x = -allow.x;
      }

      if(imgStatus.y>allow.y0){
        slipTime = this.slipTime;
        imgStatus.y = allow.y0;
      }else if(imgStatus.y<allow.y1){
        slipTime = this.slipTime;
        imgStatus.y = allow.y1;
      }

      if($img.height*imgStatus.scale<=this.winh){
        imgStatus.y = 0;
      }

      if($img.width*imgStatus.scale<=this.winw){
        imgStatus.x = 0;
      }

      imgStatus.scalem = 1;
      if(scale>this.maxScale){     //倍数大于最大限制倍数
        imgStatus.scale = this.maxScale;
        slipTime = this.slipTime;
      }else if(scale<1){//倍数小于1
        this.imgStatusRewrite();
        slipTime = this.slipTime;
      }
      if(slipTime!=0){
        this.changeIndex(0);
        this.translateScale(this.index,slipTime);
      }
    }
  };

  _previewImage.prototype.getAllow = function(index){
    var $img = this.getJqElem(index);
    var imgStatus = this.getIndexImage(index);
    var allowX = Math.floor(($img.width*imgStatus.scale-this.winw)/(2*imgStatus.scale));
    var allowY0,allowY1;
    if($img.height*imgStatus.scale<=this.winh){
      allowY0 = 0;
      allowY1 = 0;
    }else if($img.height<=this.winh){
      allowY0 = Math.floor(($img.height*imgStatus.scale-this.winh)/(2*imgStatus.scale));
      allowY1 = -allowY0;
    }else{
      allowY0 = Math.floor($img.height*(imgStatus.scale-1)/(2*imgStatus.scale));
      allowY1 = -Math.floor(($img.height*(imgStatus.scale+1)-2*this.winh)/(2*imgStatus.scale));
    }
    return {
      x:allowX,
      y0:allowY0,
      y1:allowY1,
    };
  };

  _previewImage.prototype.getSlowlyNum = function(x,maxOver){
    var maxOver = maxOver||this.winw*this.maxOverWidthPercent;
    if(x<0){
      x = -x;
      return -(1-(x/(maxOver+x)))*x;
    }else{
      return (1-(x/(maxOver+x)))*x;
    }
  };

  _previewImage.prototype.getScale = function(ts,tm){
    var fingerRangeS = Math.sqrt(Math.pow((ts.x1 - ts.x0),2)+Math.pow((ts.y1-ts.y0),2)); //两手指的初始距离
    var fingerRangeM = Math.sqrt(Math.pow((tm.x1 - tm.x0),2)+Math.pow((tm.y1-tm.y0),2)); //两手指移动过程中的距离
    var range = fingerRangeM/fingerRangeS;
    return range;
  };

  _previewImage.prototype.imgStatusRewrite = function(index){
    var index = index===undefined?this.index:index;
    var imgStatus = this.imgStatusCache[index];
    imgStatus.x = 0;
    imgStatus.y = 0;
    imgStatus.m = 0;
    imgStatus.my = 0;
    imgStatus.scale = 1;
    imgStatus.scalem = 1;
    if(index!=this.index){
      this.translateScale(index,this.slipTime);
    }
  }

  _previewImage.prototype.changeIndex = function(x){
    var imgStatus = this.getIndexImage();
    var oldIndex = this.index;
    var _this = this;
    if(this.index==0&&x==-1){
      this.index = this.index;
    }else if(this.index==this.maxLen&&x==1){
      this.index = this.index;
    }else{
      this.index+=x;
      this.$text.innerHTML = '<span class="previewImage-text-index">'+(this.index+1)+'/</span>'+(this.maxLen+1);    //当前第几张/图片总数
      var hash = this.imgStatusCache[this.index].hash;
      var imgCache = this.imgLoadCache[hash];
      if(!imgCache.isload){    //图片未缓存则加载图片
        imgCache.elem.src = this.urls[this.index];
        imgCache.elem.onload = function(){
          imgCache.elem.parentNode.className+=' previewImage-nobackground';
          imgCache.isload = true;
        }
      }else{
        imgCache.elem.parentNode.className+=' previewImage-nobackground';
      }
    }
    this.box.x = -this.imageChageMoveX*this.index;
    this.box.m = 0;
    if(oldIndex!=this.index){
      this.imgStatusRewrite(oldIndex);
    }
    this.translateScale(this.bIndex,this.slipTime);
  }

  _previewImage.prototype.getIndexImage = function(index){
    var index = index==undefined?this.index:index;
    return  this.imgStatusCache[this.index];
  }

  _previewImage.prototype.translateScale = function (index,duration){
    var imgStatus = this.imgStatusCache[index];
    var $elem = this.getJqElem(index);
    var scale = imgStatus.scale*imgStatus.scalem;
    var offsetX = imgStatus.x+imgStatus.m;
    var offsetY = imgStatus.y+imgStatus.my;
    var tran_3d='scale3d('+scale+','+scale+',1) '+' translate3d(' + offsetX + 'px,' + offsetY + 'px,0px)';
    // var tran_2d='scale('+scale+','+scale+') '+' translate(' + offsetX + 'px,' + offsetY +'px)';
    var transition = 'transform '+duration+'s ease-out';
    this.addCssPrefix($elem,'transition',transition);
    this.addCssPrefix($elem,'transform',tran_3d);
  }

  _previewImage.prototype.getJqElem = function(index){
    var $elem;
    var index = index==undefined?this.index:index;
    if(index<=this.maxLen){
      var hash = this.imgStatusCache[index].hash;
      var img = this.imgLoadCache[hash].elem;
      $elem = img;
    }else{
      var elem = this.imgStatusCache[index].elem;
      $elem = elem;
    }

    return $elem
  }
  /**
   * [addCssPrefix 增加css前缀]
   * @param {[elem]} elem  [element]
   * @param {[string]} prop  [css attribute]
   * @param {[string]} value [css value]
   */
  _previewImage.prototype.addCssPrefix = function(elem,prop,value){    //可以优化todo
    for(var i in this.cssprefix){
      var cssprefix = this.cssprefix[i];
      if(cssprefix===''){
        prop = prop.toLowerCase();
      }else{
        var len = prop.length;
        prop = prop.substr(0,1).toUpperCase()+prop.substr(1,len).toLowerCase()
      }
      if(document.body.style[prop]!==undefined){
        elem.style[prop] = value;
        return
      }
    }
  }

  _previewImage.prototype.getTouches = function(e){
    var touches = event.touches.length>0?event.touches:event.changedTouches;
    var obj = {touches:touches,length:touches.length};
    obj.x0 = touches[0].pageX
    obj.y0 = touches[0].pageY;
    obj.time = new Date().getTime();
    if(touches.length>=2){
      obj.x1 = touches[0].pageX
      obj.y1 = touches[1].pageY
    }
    return obj;
  }
  window.previewImage = new _previewImage();
  // AMD loader
  if ( typeof define === 'function' && define.amd ) {
    define([], function() {
      return previewImage;
    } );
  }

  return previewImage;
}));
/* 图片放大预览结束 */
