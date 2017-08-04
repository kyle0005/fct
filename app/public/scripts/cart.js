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
new Vue(
  {
    watch:{
      'ischeck':function(){
        alert('2222:'+(this.ischeck.length));
        if(this.pro_list.length===this.ischeck.length){
          this.checkAll=true;
        }else{
          this.checkAll=false;
        }
        this.choose_num = this.ischeck.length;
        this.caltotalpri();

      },
      checkAll(yes) {
        this.checkAll = yes;
        alert('3333:'+(this.checkAll));
      }
    },
    data() {
      return {
        min: false,   /* 产品数量最小值 */
        max: false,   /* 产品数量最大值 */
        showAlert: false, //显示提示组件
        msg: null, //提示的内容
        pro_list: [],
        ischeck:[],//获取选项框数据
        checkAll: false,//全选
        choose_num: 0,
        total_pri: 0,
        like_list: []
      }
    },
    mounted: function() {
      this.loadPro();
      this.show_like();
    },
    methods: {
      add(item){
        let vue = this,
          num = parseInt(item.buyCount.toString().replace(/[^\d]/g,''));
        if(vue.min){
          vue.min = false;
        }
        if(num < item.stockCount){
          num += 1;
          if(num === item.stockCount){
            vue.max = true;
          }
        }
        jAjax({
          type:'post',
          url:config.cart_add_url,
          data: {
            'buy_number': num - item.buyCount,
            'product_id ': item.goodsId,
            'spec_id': item.specId
          },
          // data: formData.serializeForm('buyOrder'),
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
              console.log('ok')
              }else {
                console.log('false')
              }
            }

          },
          error:function(status, statusText){
            console.log(statusText);
          }
        });
        item.buyCount = num;
        vue.caltotalpri();
      },
      minus(item){
        let vue = this,
          num = parseInt(item.buyCount.toString().replace(/[^\d]/g,''));
        if(vue.max){
          vue.max = false;
        }
        if(num > 0){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          jAjax({
            type:'post',
            url:config.cart_minus_url,
            data: {
              'buy_number': num - item.buyCount,
              'product_id ': item.goodsId,
              'spec_id': item.specId
            },
            timeOut:5000,
            before:function(){
              console.log('before');
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                if(parseInt(data.code) == 200){
                  console.log('ok')
                }else {
                  console.log('false')
                }
              }

            },
            error:function(status, statusText){
              console.log(statusText);
            }
          });
          item.buyCount = num;
        }
        vue.caltotalpri();
      },
      selectedProduct: function(item) {
        if (typeof item.checked == 'undefined') {
          this.$set(item, 'checked', true);
        }
        else {
          item.checked = !item.checked;
        }
        this.caltotalpri();
      },
      caltotalpri(){
        let vue = this;
        vue.total_pri = 0;
        /* 计算价格 */
        vue.ischeck.forEach((item) => {
          if (item.checked) {
            vue.total_pri += (parseFloat(item.promotionPrice) * parseFloat(item.buyCount));
          }
        });
        vue.total_pri = vue.total_pri.toFixed(2);

      },
      chooseall(){
        let vue = this;
        let ischeck = [];
        alert('1111:'+(vue.checkAll));
        if (!vue.checkAll) {
          vue.pro_list.forEach((item) => {
            ischeck.push(item);
          });
          // alert('ischeck:'+ischeck)
        }
        vue.choose_num = ischeck.length;
        vue.ischeck = ischeck;
        // alert('choose_num:'+vue.choose_num)
        vue.pro_list.forEach((item) => {
          if (typeof item.checked == 'undefined') {
            this.$set(item, 'checked', !vue.checkAll);
          }
          else {
            item.checked = !vue.checkAll;
          }
        });
        vue.caltotalpri();

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
      show_like(){
        let vue = this;
        vue.like_list = config.like_list;
      },
      linkto(url){
        if(url){
          location.href = 'http://localhost:9000/login.html';
        }
      },
      loadPro(){
        let vue = this;
        vue.pro_list = config.carts;
      },
      buy(){
        let vue = this,cart_list = [];
        vue.ischeck.forEach((item) => {
          let _item = {};
          _item.goodsId = item.goodsId;
          _item.specId = item.specId;
          _item.buyCount = item.buyCount;
          cart_list.push(_item);
        });
        if(cart_list.length > 0){
          location.href = encodeURI(config.buy_url + '?product=' + base64.encode64(JSON.stringify(cart_list)));
        }
      }
    }
  }
).$mount('#cart');
