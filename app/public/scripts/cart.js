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
var app = new Vue(
  {
    data() {
      return {
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
        input_val: 1,
        min: false,
        pro_list: []
      }
    },
    mounted: function() {
      this.loadPro();
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
          location.href = "http://localhost:9000/login.html";
        }
      },
      add(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(vue.min){
          vue.min = false;
        }
        num += 1;
        vue.input_val = num;
      },
      minus(){
        let vue = this,
          num = parseInt(vue.input_val.toString().replace(/[^\d]/g,''));
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          vue.input_val = num;
        }
      },
      loadPro(){
        let vue = this;
        vue.pro_list = config.products;
      }
    }
  }
).$mount('#cart');
