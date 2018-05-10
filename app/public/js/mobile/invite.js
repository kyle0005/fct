let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.drawPic();
    },
    data: {
      username: config.user.userName,
      headportrait: config.user.headPortrait,
      qrcodeurl: config.qrcodeUrl,
      backgroundurl: config.backgroundUrl,
      logourl: config.logoUrl,
      textobj: config.textObj,
      ratio: 0
    },
    methods: {
      drawPic(){
        let vue = this;
        vue.ratio = window.devicePixelRatio || 1;
        var w_width = window.innerWidth || document.documentElement.clientWidth;
        var w_height = window.innerHeight || document.documentElement.clientHeight;
        var canvas = null;
        canvas = document.createElement('canvas');
        var _result = document.getElementById('con_result');
        canvas.width = w_width * vue.ratio;
        canvas.height = w_height * vue.ratio;

        var ctx = canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle='#edece6';
        ctx.fillRect(0, 0, w_width * vue.ratio, w_height * vue.ratio);

        var progress = 0;

        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        img.src = vue.backgroundurl;
        img.onload = function(){
          w_width = img.width;
          w_height = img.height;
          canvas.width = w_width * vue.ratio;
          canvas.height = w_height * vue.ratio;

          ctx.drawImage(img,0, 0, w_width * vue.ratio, img.height / img.width * w_width * vue.ratio);
          progress += 1;
          if(progress===4){
            vue.convertToImg(canvas, _result, w_width, w_height);
          }

          ctx.fillStyle='#993333';
          ctx.font = 12 * vue.ratio * 2 + 'px 微软雅黑';
          vue.canvasTextAutoLine(vue.username + vue.textobj.textInfo, ctx, (192 / 750 * w_width * vue.ratio ), (558 / 750 * w_width * vue.ratio), 22 * vue.ratio  * 2, (550 / 750 * w_width * vue.ratio));

          ctx.fillStyle='#666666';
          ctx.font = 13 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.textAlign = 'center';
          ctx.fillText(vue.textobj.textQrcode, (375 / 750 * w_width * vue.ratio), (1060 / 750 * w_width) * vue.ratio);

          ctx.fillStyle='#20201f';
          ctx.font = 48 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.fillText(vue.textobj.textM, (65 / 750 * w_width * vue.ratio), (1259 / 750 * w_width) * vue.ratio);

          ctx.fillStyle='#20201f';
          ctx.font = 48 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.fillText(vue.textobj.textM, (65 / 750 * w_width * vue.ratio), (1302 / 750 * w_width) * vue.ratio);

          ctx.fillStyle='#20201f';
          ctx.textAlign = 'left';
          ctx.font = 'bold ' + 17 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.fillText(vue.textobj.textTip, (55 / 750 * w_width * vue.ratio), (1170 / 750 * w_width) * vue.ratio);

          ctx.fillStyle='#20201f';
          ctx.font = 12 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.fillText(vue.textobj.textLine1, (90 / 750 * w_width * vue.ratio), (1234 / 750 * w_width) * vue.ratio);

          ctx.fillStyle='#20201f';
          ctx.font = 12 * vue.ratio * 2 + 'px 微软雅黑';
          ctx.fillText(vue.textobj.textLine2, (90 / 750 * w_width * vue.ratio ), (1277 / 750 * w_width) * vue.ratio);

          var photo = new Image();
          photo.setAttribute('crossOrigin','anonymous');
          photo.src = vue.headportrait;
          photo.onload = function(){
            vue.circleImg(ctx, photo, (303 / 750 * w_width), (334 / 750 * w_width), (70 / 750 * w_width));
            progress += 1;
            if(progress===4){
              vue.convertToImg(canvas, _result, w_width, w_height);
            }
          };

          var qrcode = new Image();
          qrcode.setAttribute('crossOrigin','anonymous');
          qrcode.src = vue.qrcodeurl;
          qrcode.onload = function(){
            ctx.drawImage(qrcode,(228 / 750 * w_width) * vue.ratio, (737 / 750 * w_width) * vue.ratio, (294 / 750 * w_width) * vue.ratio, (294 / 750 * w_width) * vue.ratio);
            progress += 1;
            if(progress===4){
              vue.convertToImg(canvas, _result, w_width, w_height);
            }
          };

          var logo = new Image();
          logo.setAttribute('crossOrigin','anonymous');
          logo.src = vue.logourl;
          logo.onload = function(){
            ctx.drawImage(logo, (646 / 750 * w_width) * vue.ratio, (1222 / 750* w_width) * vue.ratio, (52 / 750 * w_width) * vue.ratio, (52 / 750 * w_width) * vue.ratio);
            progress += 1;
            if(progress===4){
              vue.convertToImg(canvas, _result, w_width, w_height);
            }
          };


        };

      },
      convertToImg(canvas, _result, w_width, w_height){
        let vue = this;
        let _img = Canvas2Image.convertToImage(canvas, w_width * vue.ratio, w_height * vue.ratio);
        _img.style.width = '100%';
        _result.appendChild(_img);
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
        var cx = (x + r) * vue.ratio;
        var cy = (y + r) * vue.ratio;

       ctx.beginPath();
       ctx.lineWidth = 6 * vue.ratio * 2;
       ctx.strokeStyle = '#fff';
       ctx.arc(cx, cy, r * vue.ratio, 0, 2 * Math.PI);
       ctx.stroke();
       ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x * vue.ratio, y * vue.ratio , d * vue.ratio, d * vue.ratio);
        ctx.restore();
      },
      canvasTextAutoLine(str, ctx, initX, initY, lineHeight, txtWidth) {
        var that = this;
        var lineWidth = 0;
        var canvasWidth = txtWidth;
        var lastSubStrIndex = 0;
        for (let i = 0; i < str.length; i++) {
          lineWidth += ctx.measureText(str[i]).width;
          if (lineWidth > canvasWidth - initX) {//减去initX,防止边界出现的问题
            ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
            initY += lineHeight;
            lineWidth = 0;
            lastSubStrIndex = i;
          }
          if (i == str.length - 1) {
            ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
          }
        }
      },

    },
  }
).$mount('#invite');
