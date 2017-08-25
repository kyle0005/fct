const cate = {
  data () {
    return {
      articleCategories: config.articleCategories,
      show: false,
      keywords: '',
      searchlist: []
    }
  },
  directives: {
    focus: {
      update: function (el) {
        el.focus();
      }
    }
  },
  methods: {
    pop(){
      this.keywords = '';
      this.show = !this.show;
    },
    clear(){
      let vue = this;
      vue.keywords = '';
    },
    search(){
      let vue = this, _data = [];
      _data = vue.searchNotes(config.articles, vue.keywords);
      vue.searchlist = _data;
      vue.show = !vue.show;
    },
    searchNotes(data, value) {
      var aData = [],
        aSearch = value.split(' '),
        k = 0,
        regStr = '',
        reg;
      for (var r = 0, lenR = aSearch.length; r < lenR; r++) {
        regStr += '(' + aSearch[r] + ')([\\s\\S]*)';
      }
      reg = new RegExp(regStr);

      for (var i = 0, lenI = data.length; i < lenI; i++) {
        var title = data[i].title,
          regMatch = title.match(reg),
          searchData = {};
        k = 0;
        if (regMatch !== null) {
          for (var obj in data[i]) {
            if (data[i].hasOwnProperty(obj)) {
              searchData[obj] = data[i][obj];
            }
          }
          aData.push(searchData);
        }
      }
      return aData;
    }
  },
  template: '#articlecate'
};
const list = {
  data () {
    return {
      articles: []
    }
  },
  beforeRouteEnter (route, redirect, next) {
    let _tmp = {};
    config.articleCategories.forEach(function (item) {
      if(route.query.id == item.id){
        _tmp = item;
      }
    });
      next(vm => {
        vm.articles = _tmp.articles;
      })
  },
  template: '#articlelist'
};
const detail = {
  data () {
    return {
      article: {}
    }
  },
  beforeRouteEnter (route, redirect, next) {
    let _tmp = {};
    config.articles.forEach(function (item) {
      if(route.query.articleId == item.id){
        _tmp = item;
      }
    });
    next(vm => {
      vm.article = _tmp;
    })
  },
  template: '#articledetail'
};
const router = new VueRouter({
  routes: [
    { path: '/', component: cate },
    { path: '/list', name: 'list', component: list },
    { path: '/detail', name: 'detail', component: detail }
  ]
});
let app = new Vue(
  {
    router,
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    mounted: function() {
      let vue = this;
    },
    data: {
      articleCategories: config.articleCategories
    },
    methods: {
    },
  }
).$mount('#help');
