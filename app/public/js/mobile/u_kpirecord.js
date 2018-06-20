let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
    },
    data: {
      kpilist: config.kpi.entries,
      pager: config.kpi.entries.pager,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false
    },
    watch: {
      kpilist: function (val, oldVal) {
        if(!this.listloading){
          if(this.kpilist && this.kpilist.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      initData(){
        let vue = this;
        vue.listloading = false;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.kpiurl + '&page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.nextSucc, vue.getBefore);
          }

        }
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.kpilist = vue.kpilist.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
      },
    },
  }
).$mount('#kpirecord');
