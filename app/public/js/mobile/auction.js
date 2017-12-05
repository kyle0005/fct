let _time_html = '<span :endTime="endTime" :callback="callback" >'+
  '<slot><span class="time-block">{{ time_content.hour }}</span>:<span class="time-block">{{ time_content.min }}</span>:<span class="time-block">{{ time_content.sec }}</span></slot>' +
  '</span>';
Vue.component('m-time',
  {
    template: _time_html,
    data(){
      return {
        time_content: {
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        },
      }
    },
    props:{
      endTime:{
        type: Number,
        default :0
      },
      callback : {
        type : Function,
        default :''
      }
    },
    mounted () {
      this.countdowm(this.endTime)
    },
    methods: {
      countdowm(timestamp){
        let self = this, _initTime = new Date().getTime();
        let timer = setInterval(function(){
          let nowTime = new Date();
          let endTime = new Date(timestamp * 1000 + _initTime);
          let t = endTime.getTime() - nowTime.getTime();
          if(t>0){
            let day = Math.floor(t/86400000);
            let hour=Math.floor((t/3600000)%24);
            let min=Math.floor((t/60000)%60);
            let sec=Math.floor((t/1000)%60);
            hour = hour + day * 24;
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            if(day > 0){
              // format =  `${day}天${hour}小时${min}分${sec}秒`;
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour > 0 ){
              self.time_content.hour = hour;
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
            if(day <= 0 && hour <= 0){
              self.time_content.min = min;
              self.time_content.sec = sec;
            }
          }else{
            clearInterval(timer);
            self._callback();
          }
        },1000);
      },
      _callback(){
        if(this.callback && this.callback instanceof Function){
          this.callback(...this);
        }
      }
    }
  }
);
let app = new Vue(
  {
    mounted: function () {
      let vue = this;
      vue.initData();
    },
    data: {
      pro_list: [],
      loading: false,
      refreshing: false,
      msg: 0,
      isindex: config.isindex,
      code: '',
      _code: '',
      tab_num: null,

      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,

      pager_url: '?level_id=0',
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      pager: config.products.pager,

    },
    watch: {
      pro_list: function (val, oldVal) {
        if(!this.listloading){
          if(this.pro_list && this.pro_list.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      tip(item, index){
        let vue = this;
        jAjax({
          type:'post',
          url:config.auction_remind_url,
          data: {
            'goods_id': item.id
          },
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.pro_list[index].remindId = data.data;
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
      setClock(timestamp){
        let vue = this, _initTime = new Date().getTime();
        let time_content = {
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        };
        let nowTime = new Date();
        let endTime = new Date(timestamp * 1000 + _initTime);
        let t = endTime.getTime() - nowTime.getTime();
        if(t>0) {
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          hour = hour + day * 24;
          hour = hour < 10 ? '0' + hour : hour;
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          if (day > 0) {
            time_content.hour = hour;
            time_content.min = min;
            time_content.sec = sec;
          }
          if (day <= 0 && hour > 0) {
            time_content.hour = hour;
            time_content.min = min;
            time_content.sec = sec;
          }
          if (day <= 0 && hour <= 0) {
            time_content.min = min;
            time_content.sec = sec;
          }
        }
        return time_content;
      },
      initData(){
        let vue = this;
        vue.pro_list = config.products.entries;
        vue.listloading = false;
        vue.tab_num = 0;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      /* 菜单分类加载 */
      getprolist(code) {
        let vue = this;
        vue.pro_list = {};
        vue.nodata = false;

        let _url = '';
        code = code || '';
        _url = '?code=' + code;
        vue._code = code;
        _url = config.auction_url + _url;
        vue.pager_url = _url;
        tools.ajaxGet(_url, vue.getSucc, vue.getBefore);

      },
      getSucc(data){
        let vue = this;
        vue.pro_list = data.data.entries;
        vue.pager = data.data.pager;
        vue.code = vue._code;

        vue.listloading = false;

      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = vue.pager_url + '&page=' + vue.pager.next;
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
        vue.pro_list = vue.pro_list.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
      },
      end(){
        console.log('end')
      }
    },
  }
).$mount('#auction');
