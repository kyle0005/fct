let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.initdata();
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      refund: [],
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.refund.pager,
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false
    },
    watch: {
      refund: function (val, oldVal) {
        if(!this.listloading){
          if(this.refund && this.refund.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      initdata(){
        let vue = this;
        vue.refund = config.refund.entries;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.refund.refundUrl + '?page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.refund = vue.refund.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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
).$mount('#aftersale');
