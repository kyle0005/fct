Vue.component('pop',
  {
    template: '#pop',
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
      let vue = this;

    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      status: 0,
      tabs: ['宝贝', '合作艺人'],
      tab_num: 0,
      collection: config.collection
    },
    watch: {
    },
    methods: {
      del(item, index){
        let vue = this;
        jAjax({
          type:'post',
          url:config.collectionDel + '?from_type=' + item.favType + '&from_id=' + item.favoriteId,
          data: {
            'keyword': vue.keywords
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.collection.splice(index, 1);
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });
      },
      category(index){
        let vue = this;
        vue.preventRepeatReuqest = false;
        vue.tab_num = index;
        var _url = config.collectionUrl + '?from_type=' + index;
        jAjax({
          type:'get',
          url:_url,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.collection = data.data;
              }else {
                console.log('false')
              }
            }

          },
          error:function(){
            console.log('error');
          }
        });

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
).$mount('#collection');