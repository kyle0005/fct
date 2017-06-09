Vue.component('head-top',
  {
    template: '#head_top',
    computed: {
    },
    mounted: function() {
      this.getTypeList();
    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {
        open: false,
        docked: false,
        transitionName: 'slide-left',
        list: [],
        loading: false,
        refreshing: false,
        img_url: 'public/images'
      }
    },
    methods: {
      toIndex(num){
        this.$router.push({
          path: '/'
        });
        this.$store.commit('addType', num);
        this.$store.commit('addRank', num);
      },
      toLogin(){
        this.$router.push({
          path: '/login'
        });
      },
      change(index) {
        let path = '/main/prolist';
        let params = this.$route.query;
        let queryObj = {
          typeid: index || 0
        };
        if(params.rankid !== undefined){
          queryObj.rankid = params.rankid;
        }
        this.$router.push({
          path: path,
          query: queryObj
        });
        this.$store.commit('addType', index);
      },
      back(n) {
        if (n) {
          this.$router.push({
            path: 'home'
          });
        } else {
          window.history.back()
        }
      },
      toggle(flag) {
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
      prevent(event) {
        event.preventDefault()
        event.stopPropagation()
      },
      getTypeList() {
        let vue = this;
        api.getTypeResource().then(function(response) {
          vue.list = (response.data.data);
        });

      },
    },
    components: {
    }
  }
);
var app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      this.getRankList();
    },
    activated() {

    },
    deactivated() {

    },
    data() {
      return {
        list: [],
        loading: false,
        refreshing: false,
        img_url: 'public/images'
      }
    },
    watch: {
    },
    methods: {
      change(index) {
        let path = '/main/prolist';
        let params = this.$route.query;
        let queryObj = {
          rankid: index || 0
        };
        if(params.typeid !== undefined){
          queryObj.typeid = params.typeid;
        }
        this.$router.push({
          path: path,
          query: queryObj
        });
        this.$store.commit('addRank', index);
      },
      getRankList() {
        let vue = this;
        api.getRankResource().then(function(response) {
          vue.list = (response.data.data);
        });

      },
    },
    components: {
      // headTop
    }
  }
).$mount('#main');
