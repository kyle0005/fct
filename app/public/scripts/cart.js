new Vue(
  {
    watch:{
      'ischeck':function(){
        let vue = this;
        vue.choose_num = vue.ischeck.length;
        vue.caltotalpri();

      },
    },
    computed: {
      all: {
        get: function () {
          return this.pro_list ? this.ischeck.length == this.pro_list.length : false;
        },
        set: function (value) {
          var selected = [];

          if (value) {
            this.pro_list.forEach(function (item) {
              selected.push(item);
            });
          }

          this.ischeck = selected;
        }
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
        choose_num: 0,
        total_pri: 0.00,
        like_list: [],
        callback: null,
        showConfirm: false, /* 显示confirm组件 */
        cartItem: null,

        listloading: false,
        nodata: false
      }
    },
    mounted: function() {
      let vue = this;
      vue.loadPro();
      vue.show_like();
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
            'product_id': item.goodsId,
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
      minus(item, index){
        let vue = this,
          num = parseInt(item.buyCount.toString().replace(/[^\d]/g,''));
        if(vue.max){
          vue.max = false;
        }
        if(num > 1){
          num -= 1;
          if(num === 0){
            vue.min = true;
          }
          jAjax({
            type:'post',
            url:config.cart_minus_url,
            data: {
              'buy_number': num - item.buyCount,
              'product_id': item.goodsId,
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
        else if(num === 1){
          item.index = index;
          vue.confirm(item, vue.delCart);
        }
        vue.caltotalpri();
      },
      delCart(item){
        let vue = this,
          num = parseInt(item.buyCount.toString().replace(/[^\d]/g,''));
        jAjax({
          type:'post',
          url:config.delete_url + '/' + item.id + '/delete',
          data: {},
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.pro_list.splice(item.index, 1);
                vue.msg = data.message;
                vue.showAlert = true;
                if(data.url){
                  vue.close_auto(vue.linkto, data.url);
                }else {
                  vue.close_auto();
                }

              }else {
                console.log('false')
              }
            }

          },
          error:function(status, statusText){
            console.log(statusText);
          }
        });
      },
      caltotalpri(){
        let vue = this;
        vue.total_pri = 0.00;
        /* 计算价格 */
        vue.ischeck.forEach((item) => {
            vue.total_pri += (parseFloat(item.promotionPrice) * parseFloat(item.buyCount));
        });
        vue.total_pri = vue.total_pri.toFixed(2);

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
        vue.listloading = true;
        vue.pro_list = config.carts;
        if(vue.pro_list.length > 0){
          vue.nodata = false;
        }else {
          vue.nodata = true;
        }
        vue.listloading = false;
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
          location.href = encodeURI(config.buy_url + '?product=' + JSON.stringify(cart_list));
        }
      },
      toFloat(num) {
        return parseFloat(num).toFixed(2);
      },
      confirm(cartItem, callback){
        let vue = this;
        vue.msg = '是否要移除该宝贝？';
        vue.cartItem = cartItem;
        vue.callback = callback;
        vue.showConfirm = true;
      },
      no(){
        let vue = this;
        vue.showConfirm = false;
      },
      ok(callback, obj){
        let vue = this;
        vue.showConfirm = false;
        if(callback){
          callback(obj);
        }
      }
    }
  }
).$mount('#cart');
