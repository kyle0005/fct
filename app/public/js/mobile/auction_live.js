let app = new Vue(
  {
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容,
    },
    watch: {
    },
    mounted: function() {
      let vue = this;

    },
    methods: {
      close_auto(callback, obj){
        let vue = this;
        setTimeout(function () {
          vue.showAlert = false;
          if(callback){
            callback(obj);
          }

        }, 1500);

      },
      postSuc(data, item){
        let vue = this;

      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },
      vodLive(live_url){
  var wid = $(document).width();
  //live
  var PLAY_INFO = (function(){
    var ps = (window.location.href.split('?')[1] || '').split('&')
      , opt = {
        "channel_id": live_url,
        "app_id": configs.app_id,
        "width": 0,
        "height": 0,
        "https":0
      }
      , i1 = 0 , i2 = ps.length, i3, i4
    ;
    for (; i1 < i2; i1++) {
      i3 = ps[i1];
      i4 = i3.split('=');
      if(i4[0] == '$app_id' || i4[0] == 'app_id'){
        opt.app_id = i4[1];
      } else if(i4[0] == '$channel_id' || i4[0] == 'channel_id'){
        opt.channel_id = i4[1];
      } else if(i4[0] == '$sw' || i4[0] == 'sw'){
        opt.width = i4[1];
      } else if(i4[0] == '$sh' || i4[0] == 'sh'){
        opt.height = i4[1];
      } else if(i4[0] == 'cache_time'){
        opt.cache_time = i4[1];
      } else if(i4[0] == 'https'){
        opt.https = i4[1];
      }
    }

    return opt;
  })();
  (function () {
    new qcVideo.Player("id_video_container", {
      "channel_id": live_url,
      "app_id": configs.app_id,
      "width": wid,
      "height": 244,
      "https": 0
    });

  })();
}
    },
    components: {
    }
  }
).$mount('#auctionlive');
