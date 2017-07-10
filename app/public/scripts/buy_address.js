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
      vue.defaultAddr();
    },
    data: {
      address: config.address,
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      picked: ''
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
      edit(){
        let vue = this;
        vue.showAlert = true;
        vue.msg = 'edit';
        vue.close_auto();
      },
      del(){
        let vue = this;
        vue.showAlert = true;
        vue.msg = 'del';
        vue.close_auto();
      },
      addressStr(item){
        let vue = this;
        return item.province + item.cityId + item.townId + item.address;
      },
      defaultAddr(){
        let vue = this,
          _def = 0,
          _str = '';
        vue.address.forEach((item) => {
          _def = parseInt(item.isDefault);
          if(_def == 1){
            _str = vue.addressStr(item);
          }
        });
        vue.picked = _str;
      }
    },
  }
).$mount('#buy_address');
