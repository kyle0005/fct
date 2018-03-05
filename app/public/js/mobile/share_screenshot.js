let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.drawCanvas();
    },
    watch: {

    },
    data: {

    },
    methods: {
      drawCanvas(){
        let vue = this;
        var w_width = window.innerWidth || document.documentElement.clientWidth;
        var w_height = window.innerHeight || document.documentElement.clientHeight;
        var canvas = document.getElementById('con_screen');
        canvas.width = w_width;
        canvas.height = 970 / 750 * w_width;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle='#ffffff';
        ctx.fillRect(0, 0, w_width, 970 / 750 * w_width);

        var img=new Image();
        img.src='http://localhost:9000/public/img/mobile/resource/pro01.png';
        img.onload = function(){
          ctx.drawImage(img,0, 0, w_width, img.height / img.width * w_width);
        };

        var photo=new Image();
        photo.src='http://localhost:9000/public/img/mobile/resource/emptyPhoto.png';
        photo.onload = function(){
          // ctx.drawImage(photo, ((w_width - 128 / 750 * w_width) / 2), (60 / 750 * w_width), (128 / 750 * w_width), (128 / 750 * w_width));
          vue.circleImg(ctx, photo, ((w_width - 128 / 750 * w_width) / 2), (60 / 750 * w_width), (128 / 750 * w_width / 2));
        };

        ctx.fillStyle='#333';
        ctx.font='1.4rem 微软雅黑';
        ctx.fillText('小凤鸣茗壶', 10, w_width + 30);

        ctx.fillStyle='#666';
        ctx.font='1.2rem 微软雅黑';
        ctx.fillText('许艳春', 10, w_width + 60);

        ctx.fillStyle='#993333';
        ctx.font='1.5rem 微软雅黑';
        ctx.fillText('￥90000.00', 10, w_width + 90);



      },
     circleImg(ctx, img, x, y, r) {
        //外圈画圆
        ctx.save();
        var d =2 * r;
        var cx = x + r;
        var cy = y + r;

       ctx.beginPath();
       ctx.lineWidth = 2;
       ctx.strokeStyle = '#fff';
       ctx.arc(cx, cy, r, 0, 2 * Math.PI);
       ctx.stroke();
       ctx.closePath();

        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
        ctx.restore();
      }
    },
  }
).$mount('#screenshot');
