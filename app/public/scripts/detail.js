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
Vue.component('pop',
  {
    template: '#pop',
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
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg'],
    methods: {
      close(){
        this.$emit('close')
      }
    }
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
      tab_num: 0,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容,
      open: false,
      docked: false,
      chosen: false,
      input_val: 1,
      specs: ['刻龙', '刻虎'],
      specs_num: 0,
      min: false,
      collected: false,
    },
    watch: {
    },
    methods: {
      collection(){
        if(!this.collected){
          this.collected = true;
          this.showAlert = true;
          this.msg = '收藏成功';
        }else {
          this.collected = false;
          this.showAlert = true;
          this.msg = '取消收藏成功';
        }

      },
      close(){
        this.showAlert = false;
      },
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
          aspectRatio: '2:1'
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
      buy(){
        location.href = 'buy.html';
      },
      add(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(vue.min){
          vue.min = false;
        }
        num += 1;
        vue.input_val = num;
      },
      minus(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          vue.input_val = num;
        }
      },
      footLinkTo(index){
        let vue = this;
        this.specs_num = index;

      },
      prevent(event) {
        event.preventDefault();
        event.stopPropagation()
      },
      choose() {
        if (!this.open) {
          this.docked = true;
          this.open = true;
        } else {
          this.open = false;
          let vue = this;
          setTimeout(function() {
            vue.docked = false;
          }, 300);
        }
      },
      chooseSpec(){
        let vue = this;
        if(!vue.chosen) {
          vue.chosen = true;
        }
        else {
          vue.chosen = false;
        }
      }

    },
    components: {
    }
  }
).$mount('#detail');
