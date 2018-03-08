let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      if(vue.imgObj.backgroundUrl !== '' && vue.imgObj.backgroundUrl !== null &&vue.imgObj.backgroundUrl !== undefined){
        vue.showBtn = false;
        vue.drawTop();
      }else {
        vue.drawCanvas();
      }
    },
    data: {
      showAlert: false, //显示提示组件
      msg: config.msg, //提示的内容
      showBtn: true,    //显示按钮
      imgObj: config.imgObj,
      ratio: 0
    },
    methods: {
      drawTop(){
        let vue = this;
        vue.ratio = window.devicePixelRatio || 1;
        var w_width = window.innerWidth || document.documentElement.clientWidth;
        var w_height = window.innerHeight || document.documentElement.clientHeight;
        var canvas = null;
        canvas = document.createElement('canvas');
        var _result = document.getElementById('con_result');
        canvas.width = w_width * vue.ratio;
        canvas.height = w_height * vue.ratio;

        // canvas.style.width = w_width + 'px';
        // canvas.style.height = 970 / 750 * w_width + 'px';

        var ctx = canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle='#ffffff';
        ctx.fillRect(0, 0, w_width * vue.ratio, w_height * vue.ratio);

        var progress = 0;

        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        img.src = vue.imgObj.backgroundUrl;
        img.onload = function(){
          ctx.drawImage(img,0, 0, w_width * vue.ratio, img.height / img.width * w_width * vue.ratio);
          progress += 1;
          if(progress===2){
            var _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, w_height * vue.ratio);
            _img.style.width = '100%';
            _result.appendChild(_img);
          }

          var qrcode = new Image();
          qrcode.setAttribute('crossOrigin','anonymous');
          qrcode.src = vue.imgObj.qrcodeUrl;
          qrcode.onload = function(){
            ctx.drawImage(qrcode,((w_width - 350 / 1242 * w_width) / 2) * vue.ratio, (1165 / 1242 * w_width) * vue.ratio, (350 / 1242 * w_width) * vue.ratio, (350 / 1242 * w_width) * vue.ratio);
            progress += 1;
            if(progress===2){
              var _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, w_height * vue.ratio);
              _img.style.width = '100%';
              _result.appendChild(_img);
            }
          };

        };

      },
      drawCanvas(){
        let vue = this;
        vue.ratio = window.devicePixelRatio || 1;
        var w_width = window.innerWidth || document.documentElement.clientWidth;
        var w_height = window.innerHeight || document.documentElement.clientHeight;
        var canvas = null;
        canvas = document.createElement('canvas');
        var _btn = document.getElementById('btn');
        var _result = document.getElementById('con_result');
        canvas.width = w_width * vue.ratio * 2;
        canvas.height = 970 / 750 * w_width * vue.ratio *2;

        canvas.style.width = w_width + 'px';
        canvas.style.height = 970 / 750 * w_width + 'px';

        var ctx = canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle='#ffffff';
        ctx.fillRect(0, 0, w_width * vue.ratio * 2, 970 / 750 * w_width * vue.ratio * 2);

        var _left = 30 / 750 * w_width * vue.ratio * 2;
        ctx.fillStyle='#333';

        ctx.font = 16 * vue.ratio * 2 + 'px 微软雅黑';
        ctx.fillText(vue.imgObj.name, _left, (w_width + (70 / 750 * w_width)) * vue.ratio * 2);

        ctx.fillStyle='#666';
        ctx.font = 15 * vue.ratio * 2 + 'px 微软雅黑';
        ctx.fillText(vue.imgObj.artistName, _left, (w_width + (120 / 750 * w_width)) * vue.ratio * 2);

        ctx.fillStyle='#993333';
        ctx.font = 20 * vue.ratio * 2 + 'px 微软雅黑';
        ctx.fillText(vue.imgObj.price, _left, (w_width + (180 / 750 * w_width)) * vue.ratio * 2);

        var progress = 0;

        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        img.src = vue.imgObj.defaultImage;
        img.onload = function(){
          ctx.drawImage(img,0, 0, w_width * vue.ratio * 2, img.height / img.width * w_width * vue.ratio * 2);
          progress += 1;
          if(progress===3){
            var _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, (970 / 750 * w_width) * vue.ratio);
            _img.style.width = '100%';
            _result.insertBefore(_img, _btn);
          }

          var qrcode = new Image();
          qrcode.setAttribute('crossOrigin','anonymous');
          qrcode.src = vue.imgObj.qrcodeUrl;
          qrcode.onload = function(){
            ctx.drawImage(qrcode,(464 / 750 * w_width) * vue.ratio * 2, (690 / 750 * w_width) * vue.ratio * 2, (260 / 750 * w_width) * vue.ratio * 2, (260 / 750 * w_width) * vue.ratio * 2);
            progress += 1;
            if(progress===3){
              var _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, (970 / 750 * w_width) * vue.ratio);
              _img.style.width = '100%';
              _result.insertBefore(_img, _btn);
            }
          };

          var photo = new Image();
          photo.setAttribute('crossOrigin','anonymous');
          photo.src = vue.imgObj.headPortrait;
          photo.onload = function(){
            vue.circleImg(ctx, photo, (32 / 750 * w_width), (32 / 750 * w_width), (100 / 750 * w_width / 2));
            progress += 1;
            if(progress===3){
              var _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, (970 / 750 * w_width) * vue.ratio);
              _img.style.width = '100%';
              _result.insertBefore(_img, _btn);
            }
          };

          // vue.preImage(_data.photo,function(){
          //   vue.circleImg(ctx, this, ((w_width - 128 / 750 * w_width) / 2), (60 / 750 * w_width), (128 / 750 * w_width / 2));
          //   progress += 1;
          //   if(progress===3){
          //     _result.insertBefore(Canvas2Image.convertToImage(canvas, w_width, (970 / 750 * w_width)), _btn);
          //   }
          // },{});
        };

      },
      preImage(url,callback,obj){
        var img = new Image();
        img.src = url;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
          callback.call(img,obj);
          return; // 直接返回，不用再处理onload事件
        }
        img.onload = function () { //图片下载完毕时异步调用callback函数。
          callback.call(img,obj);//将回调函数的this替换为Image对象
        };
        img.onerror = function(){  //图片onerror的时候带随机数（比如时间戳）重发请求,防止缓存
          var timeStamp = +new Date();
          vue.preImage(url + '?' + timeStamp,callback,obj);
        }
      },
      circleImg(ctx, img, x, y, r) {
        let vue = this;
        //外圈画圆
        ctx.save();
        var d =2 * r;
        var cx = (x + r) * vue.ratio * 2;
        var cy = (y + r) * vue.ratio * 2;

       ctx.beginPath();
       ctx.lineWidth = 3 * vue.ratio * 2;
       ctx.strokeStyle = '#fff';
       ctx.arc(cx, cy, r * vue.ratio * 2, 0, 2 * Math.PI);
       ctx.stroke();
       ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x * vue.ratio * 2, y * vue.ratio * 2 , d * vue.ratio * 2, d * vue.ratio * 2);
        ctx.restore();
      },
      pop(){
        let vue = this;
        vue.showAlert = true;
        vue.close_auto();
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
    },
  }
).$mount('#screenshot');
