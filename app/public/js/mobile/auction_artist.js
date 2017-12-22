let app = new Vue(
  {
    data: {
      artist: [],
      artistsingle: {},
      titleshow: false,
      chosen: false,
      art_num: 0,
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false
    },
    watch: {

    },
    mounted: function() {
      let vue = this;
      tools.animate(document, {scrollTop: '0'}, 400,'ease-out');
      vue.loadsingle();
    },
    methods: {
      getBefore(){
        let vue = this;
      },
      loadsingle(index){
        let vue = this;
        vue.artistsingle = config.artist;
        vue.listloading = false;
      },
      getSucc(data){
        let vue = this;
        vue.artist = data.data;
        vue.titleshow = vue.artist.length > 1;
        vue.loadsingle(0);
      }
    },
    components: {
    }
  }
).$mount('#auctionartist');
