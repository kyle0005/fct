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
        vue.provinceName = provinceName[vue.province];
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
        vue.cityName = cityName[vue.city];
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
        vue.countyName = countyName[vue.county];
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
      address_obj: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      citylist: citylist,
      isFir: true,

      id: config.address.id || '',
      province: config.address.province || '北京',
      city: config.address.cityId || '北京',
      county: config.address.townId || '东城区',

      provinceName: '',
      cityName: '',
      countyName: '',

      isDefault: config.address.isDefault || 1,
      address: config.address.address || '',
      cellPhone: config.address.cellPhone || '',
      name: config.address.name || '',

      // subText: '确认保存'
    },
    methods: {
      sub(){
        let vue = this,
          post_url = config.saveAddressddUrl,
          post_data = {
            'id': vue.id,
            'province': vue.provinceName || '',
            'city': vue.cityName || '',
            'county': vue.countyName || '',
            'isDefault': vue.isDefault ? 1:0,
            'address': vue.address,
            'cellPhone': vue.cellPhone,
            'name': vue.name
          };
        vue.$refs.subpost.post(post_url, post_data);
      },
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
      postSuc(data){
        let vue = this;
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },
      succhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
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
      }
    },
  }
).$mount('#buy_address');
