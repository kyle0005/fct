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
      provincesName:function(){
        var provinceName={};
        for(var i in addrobj){
          provinceName[i]=addrname[i];
        }
        return provinceName
      },
      citysName:function(){
        var cityName={};
        for(var i in addrobj[this.province]){
          cityName[i]=addrname[i]
        }
        return cityName
      },
      countysName:function(){
        var countyName={};
        for(var i in addrobj[this.province][this.city]){
          var county=addrobj[this.province][this.city][i];
          countyName[county]=addrname[county]
        }
        return countyName
      },
    },
    watch:{
      'province':function(n,o){
        if(n!=o) this.city=Object.getOwnPropertyNames(this.citysName)[0];
      },
      'city':function(n,o){
        if(n!=o) this.county=Object.getOwnPropertyNames(this.countysName)[0];
      }
    },
    mounted: function() {
      let vue = this;
    },
    data: {
      address: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      province:10,
      city:20,
      county:31
    },
    methods: {
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
).$mount('#buy_address');
