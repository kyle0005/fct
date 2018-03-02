let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    watch: {

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容

    },
    methods: {
      convert2canvas() {
        var cntElem = document.body;

        var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
        var width = shareContent.offsetWidth; //获取dom 宽度
        var height = shareContent.offsetHeight; //获取dom 高度
        var canvas = document.createElement("canvas"); //创建一个canvas节点
        var scale = 2; //定义任意放大倍数 支持小数
        canvas.width = width * scale; //定义canvas 宽度 * 缩放
        canvas.height = height * scale; //定义canvas高度 *缩放
        canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
        var opts = {
          scale: scale, // 添加的scale 参数
          canvas: canvas, //自定义 canvas
          // logging: true, //日志开关，便于查看html2canvas的内部执行流程
          width: width, //dom 原始宽度
          height: height,
          useCORS: true // 【重要】开启跨域配置
        };

        html2canvas(shareContent, opts).then(function (canvas) {

          var context = canvas.getContext('2d');
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;

          // 【重要】默认转化的格式为png,也可设置为其他格式
          var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);

          document.body.appendChild(img);
          img.style.height = canvas.height / 2 + 'px';
          img.style.width = canvas.width / 2 + 'px';
          img.className += ' f-full';

        });
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
