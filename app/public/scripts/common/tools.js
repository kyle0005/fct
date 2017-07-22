/**
 * Created by Administrator on 2017/6/27.
 */
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
            element.scrollTop = iCurrent + iSpeed;
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
      target = element.scrollTop;
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
  }
};
