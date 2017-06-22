let app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      let vue = this;
      vue.getProductsType();
      vue.load();
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
      tabs: [],
      tab_num: 0,
      list: []
    },
    watch: {
    },
    methods: {
      getProductsType() {
        let vue = this;
        jAjax({
          type:'get',
          url:apis.encyclopedias_type,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.tabs = (data);
              vue.linkTo(0);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      load(){
        var swiper = new Swiper('.swiper-container.tab-container', {
          centeredSlides: true,
          slidesPerView: 'auto',
          pagination: '.swiper-pagination'
        });
      },
      linkTo(num){
        let vue = this;
        this.tab_num = num;
        jAjax({
          type:'get',
          url:apis.encyclopedias_type + '?id=' + num,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              console.log(data);
              let _data = data[0].data;
              let resLength = _data.length;
              let tmp = [];
              for (let i = 0, j = 0; i < resLength; i += 12, j++) {
                tmp[j] = _data.splice(0, 12);
              }
              vue.list = tmp;
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
    },
    components: {
    }
  }
).$mount('#encyclopedias');
