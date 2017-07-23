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
        let vue = this;
        var provinceName={};
        vue.toProvince();
        vue.citylist.forEach((item, index) => {
          provinceName[index] = item.p;
        });
        return provinceName
      },
      citysName:function(){
        let vue = this;
        var cityName={};
        if(vue.citylist[vue.province] && vue.citylist[vue.province].c){
          vue.toCity();
          vue.citylist[vue.province].c.forEach((item, index) => {
            cityName[index]=item.n
          });
        }
        return cityName
      },
      countysName:function(){
        let vue = this;
        var countyName={};
        if(vue.citylist[vue.province] && vue.citylist[vue.province].c[vue.city] && vue.citylist[vue.province].c[vue.city].a){
          vue.toCounty();
          vue.citylist[vue.province].c[vue.city].a.forEach((item, index) => {
            countyName[index] = item.s;
          });
        }
        return countyName
      },
    },
    watch:{
      'province':function(n,o){
        if(n!=o && !this.isFir) this.city=Object.getOwnPropertyNames(this.citysName)[0];
      },
      'city':function(n,o){
        if(n!=o && !this.isFir) this.county=Object.getOwnPropertyNames(this.countysName)[0];
        this.isFir = false;
      }
    },
    mounted: function() {
      let vue = this;
    },
    data: {
      address: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      citylist: citylist,
      isFir: true,

      province:"辽宁",
      city:"大连",
      county:"西岗区",

      isDefault: 1,
      address: "",
      cellPhone: "",
      name: ""

    },
    methods: {
      toProvince(){
        let vue = this;
        vue.citylist.forEach((item, index) => {
          if(item.p == vue.province){
            vue.province = index;
          }
        });
      },
      toCity(){
        let vue = this;
        vue.citylist[vue.province].c.forEach((item, index) => {
          if(item.n == vue.city){
            vue.city = index;
          }
        });
      },
      toCounty(){
        let vue = this;
        vue.citylist[vue.province].c[vue.city].a.forEach((item, index) => {
          if(item.s == vue.county){
            vue.county = index;
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
).$mount('#buy_address');
