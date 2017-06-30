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

var num_template = '<div class="num">' +
  '<a href="javascript:;" :class="{dis:min}" @click="minus()">' +
  '<i class="fa fa-minus"></i>' +
  '</a>' +
  '<input type="text" class="numbers" v-model="input_num">' +
  '<a href="javascript:;" @click="add()">' +
  '<i class="fa fa-plus"></i>' +
  '</a>' +
  '</div>';
Vue.component('num',
  {
    template: num_template,
    data() {
      return {
        input_num: this.num,
        min: false,   /* 产品数量最小值 */
        max: false,   /* 产品数量最大值 */
        stock_num: config.products.stock_num
      }
    },
    props: {
      num: {
        type: Number,
        default: 1
      },
    },
    methods: {
      add(){
        let vue = this,
          num = parseInt(vue.input_num.toString().replace(/[^\d]/g,''));
        if(vue.min){
          vue.min = false;
        }
        if(num < vue.stock_num){
          num += 1;
          if(num === vue.stock_num){
            vue.max = true;
          }
        }
        vue.input_num = num;
      },
      minus(){
        let vue = this,
          num = parseInt(vue.input_num.toString().replace(/[^\d]/g,''));
        if(vue.max){
          vue.max = false;
        }
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          vue.input_num = num;
        }
      },
    }
  }
);
new Vue(
  {
    data() {
      return {
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
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
          location.href = 'http://localhost:9000/login.html';
        }
      },
      loadPro(){
        let vue = this;
        vue.pro_list = config.products;
      }
    }
  }
).$mount('#cart');
