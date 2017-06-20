Vue.component('overview',
  {
    template: '#overview',
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
Vue.component('artist',
  {
    template: '#artist',
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
Vue.component('pug',
  {
    template: '#pug',
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
Vue.component('service',
  {
    template: '#service',
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
Vue.component('discuss',
  {
    template: '#discuss',
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
      this.loadVideo();
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
      img_url: 'public/images',
      currentView: 'overview',
      tabs: ['概览', '艺人', '泥料', '售后保障', '评论'],
      tab_num: 0
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
            vue.currentView ='overview';
            break;
          case 1:
            vue.currentView ='artist';
            break;
          case 2:
            vue.currentView ='pug';
            break;
          case 3:
            vue.currentView ='service';
            break;
          case 4:
            vue.currentView ='discuss';
            break;
          default:
            vue.currentView ='overview';
        }

      },
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
    },
    components: {
    }
  }
).$mount('#detail');
