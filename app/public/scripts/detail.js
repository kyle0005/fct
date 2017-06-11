let app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      this.loadVideo();
      this.getRankList();
      this.getProlist();
    },
    activated() {

    },
    deactivated() {

    },
    data: {
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      img_url: 'public/images'
    },
    watch: {
    },
    methods: {
      loadVideo(){
        var options = {
          fluid: true,
          aspectRatio: "2:1"
        };
        var player = videojs('my-player', options, function onPlayerReady() {
          videojs.log('Your player is ready!');
          this.play();
          this.on('ended', function() {
            videojs.log('Awww...over so soon?!');
          });
        });
      },
      change(index) {

      },
      getRankList() {
        let vue = this;
        jAjax({
          type:"get",
          url:apis.products_r_rank,
          timeOut:5000,
          before:function(){
            console.log("before");
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.ranks_list = (data);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log("error");
          }
        });

      },
      getProlist() {
        let vue = this;
        jAjax({
          type:"get",
          url:apis.allProducts,
          timeOut:5000,
          before:function(){
            console.log("before");
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.pro_list = (data);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log("error");
          }
        });

      },
    },
    components: {
    }
  }
).$mount('#detail');
