let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.drawCanvas();
    },
    data: {
      showAlert: false, //显示提示组件
      msg: config.msg, //提示的内容
      imgObj: config.imgObj
    },
    methods: {
      drawCanvas(){
        let vue = this;
        var w_width = window.innerWidth || document.documentElement.clientWidth;
        var w_height = window.innerHeight || document.documentElement.clientHeight;
        var canvas = null;
        canvas = document.createElement('canvas');
        var _btn = document.getElementById('btn');
        var _result = document.getElementById('con_result');
        canvas.width = w_width;
        canvas.height = 970 / 750 * w_width;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle='#ffffff';
        ctx.fillRect(0, 0, w_width, 970 / 750 * w_width);

        var _left = 30 / 750 * w_width;
        ctx.fillStyle='#333';
        ctx.font='1.6em 微软雅黑';
        ctx.fillText(vue.imgObj.name, _left, w_width + (70 / 750 * w_width));

        ctx.fillStyle='#666';
        ctx.font='1.5em 微软雅黑';
        ctx.fillText(vue.imgObj.artistName, _left, w_width + (120 / 750 * w_width));

        ctx.fillStyle='#993333';
        ctx.font='2em 微软雅黑';
        ctx.fillText(vue.imgObj.price, _left, w_width + (180 / 750 * w_width));

        var progress = 0;

        var img = new Image();
        img.src = vue.imgObj.defaultImage;
        img.onload = function(){
          ctx.drawImage(img,0, 0, w_width, img.height / img.width * w_width);
          progress += 1;
          if(progress===3){
            _result.insertBefore(Canvas2Image.convertToImage(canvas, w_width, (970 / 750 * w_width)), _btn);
          }

          var qrcode = new Image();
          qrcode.src = vue.imgObj.qrcodeUrl;
          qrcode.onload = function(){
            ctx.drawImage(qrcode,(464 / 750 * w_width), (690 / 750 * w_width), (260 / 750 * w_width), (260 / 750 * w_width));
            progress += 1;
            if(progress===3){
              _result.insertBefore(Canvas2Image.convertToImage(canvas, w_width, (970 / 750 * w_width)), _btn);
            }
          };

          var photo = new Image();
          photo.src = vue.imgObj.headPortrait;
          photo.onload = function(){
            vue.circleImg(ctx, photo, ((w_width - 128 / 750 * w_width) / 2), (60 / 750 * w_width), (128 / 750 * w_width / 2));
            progress += 1;
            if(progress===3){
              _result.insertBefore(Canvas2Image.convertToImage(canvas, w_width, (970 / 750 * w_width)), _btn);
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
      },
      circleImg(ctx, img, x, y, r) {
        //外圈画圆
        ctx.save();
        var d =2 * r;
        var cx = x + r;
        var cy = y + r;

       ctx.beginPath();
       ctx.lineWidth = 3;
       ctx.strokeStyle = '#fff';
       ctx.arc(cx, cy, r, 0, 2 * Math.PI);
       ctx.stroke();
       ctx.closePath();

        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
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
