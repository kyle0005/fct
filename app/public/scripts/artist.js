Vue.component('live',
  {
    template: '#live',
    computed: {
      topImg: function () {
        let vue = this, flag = false;
        config.artist.dynamicList.entries.forEach((item) => {
          if(item.isTop){
            vue.top = item;

          }
        });
        if(vue.top.images.length > 0){
          flag = true;
        }
        return flag;
      },
    },
    mounted: function() {
      let vue = this;
      vue.loadLive();
      window.addEventListener('scroll', vue.nextPage)
    },
    data() {
      return {
        dynamicList: config.artist.dynamicList,
        liveList: config.artist.dynamicList.entries,
        top: {},
      }
    },
    methods:{
      nextPage() {
        let vue = this,
          scrollTop = document.body.scrollTop,
          clientHeight = document.body.clientHeight,
          scrollHeight = document.body.scrollHeight;
        if(scrollTop + clientHeight == scrollHeight && vue.dynamicList.pager.next > 0){
          var _url = config.artistPage_url + '?page=' + vue.dynamicList.pager.next;
          jAjax({
            type:'get',
            url:_url,
            timeOut:5000,
            before:function(){
              console.log('before');
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                if(parseInt(data.code) == 200){
                  vue.dynamicList = data.data;
                  vue.liveList.concat(vue.dynamicList.entries);
                  vue.loadLive();
                  console.log('ok')
                }else {
                  console.log('false')
                }
              }

            },
            error:function(){
              console.log('error');
            }
          });
        }
      },
      loadLive(){
        let vue = this;
        vue.liveList.forEach((item, index) => {
          if(item.isTop){
            vue.liveList.splice(index, 1);
            vue.$nextTick(function () {
              // DOM 更新后回调
              vue.loadVideo("video_top", item.videoId, item.videoImage);
            });
          }else {
            vue.$nextTick(function () {
              // DOM 更新后回调
              vue.loadVideo("video_" + index, item.videoId, item.videoImage);
            });
          }

        });
      },
      loadVideo(id ,url, poster){
        let vue = this;
        if(id && url && poster){
          var options = {
            fluid: true,
            aspectRatio: '2:1',
            preload: 'auto',
            poster: poster
          };
          var player = videojs(id, options, function onPlayerReady() {
            this.src(url);
            videojs.log('Your player is ready!');
            this.play();
            this.on('ended', function() {
              videojs.log('Awww...over so soon?!');
            });
          });
        }

      },
    },
  }
);
Vue.component('works',
  {
    template: '#works',
    computed: {
    },
    mounted: function() {

    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {

      }
    },
    methods: {
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
      },
    },
  }
);
Vue.component('chat',
  {
    template: '#chat',
    computed: {
    },
    mounted: function() {

    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {

      }
    },
    methods: {
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
      },
    },
  }
);
let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;

    },
    activated() {
    },
    deactivated() {
    },
    data: {
      haslive: true,
      currentView: 'live',
      tabs: ['实时动态', '相关作品', '对话艺人'],
      tab_num: 0,
    },
    watch: {
    },
    methods: {
      linkTo(num){
        let vue = this;
        this.tab_num = num;
        switch(parseInt(num))
        {
          case 0:
            vue.currentView ='live';
            break;
          case 1:
            vue.currentView ='works';
            break;
          case 2:
            vue.currentView ='chat';
            break;
          default:
            vue.currentView ='live';
        }

      },

    },
    components: {

    }
  }
).$mount('#artist');
