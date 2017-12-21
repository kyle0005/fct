let pop_html = '<div class="pop-container" @click="fork">'+
  '<div class="inner">'+
  '<a href="javascript:;" class="fork" @click="fork">'+
  '<img :src="imgpath + `close.png`">'+
  '</a>'+
  '<div class="content">'+
  '<div v-if="obj.o.id">订单编号：{{ obj.o.id }}</div>'+
'<div v-if="obj.o.payAmount">充值金额：￥{{ obj.o.payAmount }}</div>'+
'<div v-if="obj.o.giftAmount">赠送金额：￥{{ obj.o.giftAmount }}</div>'+
'<div v-if="obj.o.amount">获得金额：<span class="pri">￥{{ obj.o.amount }}</span></div>'+
'<div v-if="obj.o.payOrderId">支付单号：{{ obj.o.payOrderId }}</div>'+
'<div v-if="obj.o.payPlatform">支付方式：{{ obj.o.payPlatform }}</div>'+
'<div v-if="obj.o.createTime">创建时间：{{ obj.o.createTime }}</div>'+
'<div v-if="obj.o.payTime">付款时间：{{ obj.o.payTime }}</div>'+
'</div>'+
'<div class="status">'+
  '<span v-if="obj.o.status==1"><img :src="imgpath + `check.png`">充值成功</span>'+
  '<span v-else><img :src="imgpath + `fork.png`">充值失败</span>'+
'</div>'+
'</div>'+
'</div>';
Vue.component('pop-detail',
  {
    template: pop_html,
    data() {
      return {}
    },
    mounted: function() {
      let vue = this;
    },
    props: ['obj', 'imgpath'],
    methods: {
      fork(){
        this.$emit('fork');
      }
    }
  }
);
let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    watch: {
      chargeRecordList: function (val, oldVal) {
        if(!this.listloading){
          if(this.chargeRecordList && this.chargeRecordList.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      chargeRecordList: [],
      pager: {},
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,

      item_obj: {},
      callback: null,
      showDetail: false   /* 显示弹窗 */
    },
    methods: {
      popdetail(item, index){
        let vue = this;
        vue.item_obj = {
          'o': item,
          'i': index
        };
        vue.showDetail = true;
      },
      fork(){
        let vue = this;
        vue.showDetail = false;
      },
      initData(){
        let vue = this;
        vue.chargeRecordList = config.chargeRecordList.entries;
        vue.pager = config.chargeRecordList.pager;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.chargeRecordUrl + '?page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.chargeRecordList = vue.chargeRecordList.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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
).$mount('#recordrecharge');
