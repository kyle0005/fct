let app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      let vue = this, _obj = '';
      if(config.encyclopedias_list && config.encyclopedias_list.length > 0){
        config.encyclopedias_list.forEach((item, index) => {
          if(item.id == vue.detail.id){
            vue.encynum = index;
            _obj = 'list' + index;

          }
        });
        let _li = document.querySelector('li[name=' + _obj + ']');
        let _ul = document.querySelector('ul[name=top]');
        _ul.scrollLeft = _li.offsetLeft;
      }
    },
    data: {
      detail: config.detail,
      encyclopedias_list: config.encyclopedias_list,
      encynum: 0,

      listloading: false,
      nodata: false
    },
    methods: {
      getBefore(){
        let vue = this;
        vue.listloading = true;
      },
      loadsingle(index, id){
        let vue = this, _url = config.ency_url + id;
        vue.encynum = index;
        tools.ajaxGet(_url, vue.encySucc, vue.getBefore);
      },
      loadency() {
        let vue = this;
        vue.nodata = false;
        tools.ajaxGet(config.ency_url + id, vue.pugSucc, vue.getBefore);
      },
      encySucc(data){
        let vue =this;
        vue.detail = [];
        vue.detail = data.data;
        vue.listloading = false;
      }
    },
    components: {
    }
  }
).$mount('#encyclopediasdetail');
