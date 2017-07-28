// generated on 2017-06-07 using generator-webapp 3.0.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const url=require('url');
const qs=require('querystring');//解析参数的库

const $ = gulpLoadPlugins();
// const reload = browserSync.reload;

let dev = true;

gulp.task('styles', () => {
  return gulp.src('app/public/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/public/styles'))
    // .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/public/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel({
      ignore: 'vue.js'
    }))
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/public/scripts'))
    // .pipe(reload({stream: true}));
});

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    // .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/public/scripts/**/*.js')
    .pipe(gulp.dest('app/public/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    // .pipe($.if(/\.html$/, $.htmlmin({
    //   collapseWhitespace: true,
    //   minifyCSS: true,
    //   minifyJS: {compress: {drop_console: true}},
    //   processConditionalComments: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true
    // })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/public/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/public/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/public/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  let json_url = 'app/mockData/data.json';
  /* json-server */
  const jsonServer = require('json-server');
  const server = jsonServer.create();
  const router = jsonServer.router(json_url);
  const middlewares = jsonServer.defaults();
  server.use(middlewares);

  server.get('/detail', (req, res) => {
    res.json({
      code: 0 ,
      msg:'',
      data: slides
    });
  });
  server.post('/uploadFile', (req, res) => {
    res.json({
      'code': 200,
      'message': '获取成功',
      'url': null,
      'data': {
        'url': '/public/images/resource/artist.png',
        'fullUrl': 'http://localhost:9000/public/images/resource/artist.png'
      }
    });
  });

  server.post('/uploadReturnImg', (req, res) => {
    res.json({
      'code': 200,
      'message': '获取成功',
      'url': null,
      'data': {
        'url': '/public/images/resource/artist.png',
        'fullUrl': 'http://localhost:9000/public/images/resource/artist.png'
      }
    });
  });

  server.post('/orderReturn', (req, res) => {
    res.json({
      'code': 200,
      'message': '提交申请成功',
      'url': null,
      'data': ''
    });
  });

  server.post('/userinfo', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': _data
    });
  });

  server.post('/comment', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '发表评论成功',
      'url': null,
      'data': ""
    });
  });

  server.post('/delAddr', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '删除成功',
      'url': null,
      'data': ''
    });
  });


  server.get('/orderlist', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 4,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 3,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 2,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 1,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 0,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },
          {
            'orderId': '1707186898922467',      //used
            'memberId': 5,
            'cellPhone': '18616311580',
            'shopId': 0,
            'points': 0,
            'accountAmount': 4991.4,
            'cashAmount': 2563.4,
            'payAmount': 7554.8,      //used
            'totalAmount': 8888,
            'couponCode': "",
            'status': 4,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': "",
            'orderGoods': [             //used
              {
                'id': 60,
                'orderId': '1707186898922467',
                'goodsId': 2,
                'goodsSpecId': 1,
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'price': 8888,
                'commission': 200,
                'promotionPrice': 7554.8,
                'couponAmount': 0,
                'payAmount': 7554.8,
                'totalAmount': 8888,
                'content': null
              }
            ],
            'orderReceiver': null,
            'settleId': 0,
            'commentStatus': 0,
            'payTime': null,
            'createTime': 1500376189000,
            'updateTime': 1500462600000,
            'expiresTime': 1500462589000,
            'finishTime': null,
            'operatorId': null
          },

        ],
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/commission', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.status);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'tradeId': '订单id',
            'createTime': '2017-02-02',
            'orderGoods': [
              {
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'commission': 8888,
              },
              {
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'commission': 8888,
              },
              {
                'name': 'goods',
                'specName': 'aaa',
                'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
                'buyCount': 1,
                'commission': 8888,
              }
            ],
            'commission': 12321.00,
            'totalCount': 4
          },
          {
            'tradeId': '订单id',
            'createTime': '2017-02-02',
            'orderGoods': [{
              'name': 'goods',
              'specName': 'aaa',
              'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
              'buyCount': 1,
              'commission': 8888,
            }],
            'commission': 12321.00,
            'totalCount': 4
          },
          {
            'tradeId': '订单id',
            'createTime': '2017-02-02',
            'orderGoods': [{
              'name': 'goods',
              'specName': 'aaa',
              'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
              'buyCount': 1,
              'commission': 8888,
            }],
            'commission': 12321.00,
            'totalCount': 4
          },
        ],
        'status': arg1.status,
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/chargeRecord', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.status);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'id': 3123,
            'createTime': '2017-02-02',
            'payAmount': 234234,   /* 充值金额 */
            'giftAmount': 324123,    /*  赠送金额 */
            'amount': 224234,       /* 获得金额 */
            'status': 0           /* 0为等待付款 */
          },
          {

            'id': 234234,
            'createTime': '2017-02-02',
            'payAmount': 234234,   /* 充值金额 */
            'giftAmount': 324123,    /*  赠送金额 */
            'amount': 224234,       /* 获得金额 */
            'status': 1
          },
        ],
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/withdrawalRecord', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.status);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'createTime': '2017-02-02',
            'bankName': 324123,
            'amount': 224234,
            'statusName': '等待财务处理'
          },
          {
            'createTime': '2017-02-02',
            'bankName': 324123,
            'amount': 224234,
            'statusName': '提现成功'
          },
          {
            'createTime': '2017-02-02',
            'bankName': 324123,
            'amount': 224234,
            'statusName': '提现成功'
          },
        ],
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/walletaccount', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.status);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'amount': 7554.8,
            'createTime': '2017-07-17 17:32',
            'remark': '购买goods',
            'balanceAmount': 4991.4
          },
          {'amount': 7453.8, 'createTime': '2017-07-17 17:30', 'remark': '购买goods', 'balanceAmount': 12546.2}
        ],
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/refundlist', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
        'entries': [
          {
            'id': '1707186898922467',      //used
            'memberId': 5,
            'orderId': '18616311580',
            'orderGoodsId': 0,
            'isReceived': 0,
            'serviceType': 4991.4,
            'refundReason': 2563.4,
            'status': 7554.8,      //used
            'refundMethod': 8888,
            'createTime': '',
            'updateTime': 4,                //used
            'goodsId': 60,
            'goodsSpecId': '1707186898922467',
            'name': 'goods',
            'specName': 'aaa',
            'img': '\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png',
            'payAmount': 7554.8,
          },
        ],
        'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });

  server.get('/couponlist', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': [
        {
          'name': '限购登堂入室级别紫砂壶',
          'amount': 30,
          'usingType': 100,
          'typeId': 1,     /* >0:部分商品，=0: 全场通用 */
          'startTime': '2017.03.03',
          'endTime': '2017.03.03',
          'auditStatus': 0,     /* 0：未使用，1：使用中，2：已使用，3：已过期 */
          'goods': [
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
          ],

        },
        {
          'name': '限购登堂入室级别紫砂壶',
          'amount': 30,
          'usingType': 100,
          'typeId': 1,     /* >0:部分商品，=0: 全场通用 */
          'startTime': '2017.03.03',
          'endTime': '2017.03.03',
          'auditStatus': 2,     /* 0：未使用，1：使用中，2：已使用，3：已过期 */
          'goods': [
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
            {
              'defaultImage': 'public/images/resource/pro01.png'
            },
          ],

        },
        {
          'name': '限购登堂入室级别紫砂壶',
          'amount': 30,
          'usingType': 100,
          'typeId': 1,     /* >0:部分商品，=0: 全场通用 */
          'startTime': '2017.03.03',
          'endTime': '2017.03.03',
          'auditStatus': 3,     /* 0：未使用，1：使用中，2：已使用，3：已过期 */
          'goods': [
            {
              'defaultImage': ''
            },
            {
              'defaultImage': ''
            },
            {
              'defaultImage': ''
            },
          ],

        },
        {
          'name': '限购登堂入室级别紫砂壶',
          'amount': 30,
          'usingType': 100,
          'typeId': 1,     /* >0:部分商品，=0: 全场通用 */
          'startTime': '2017.03.03',
          'endTime': '2017.03.03',
          'auditStatus': 0,     /* 0：未使用，1：使用中，2：已使用，3：已过期 */
          'goods': [
            {
              'defaultImage': ''
            },
            {
              'defaultImage': ''
            },
            {
              'defaultImage': ''
            },
          ],

        }
      ],

    });
  });

  server.get('/collection', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': [
        {
          'id':8,
          'title':'xxxxx',
          'image':'/public/images/resource/imgs.png',
          'favoriteId': 5
        },
        {
          'id':9,
          'title':'dddd',
          'image':'/public/images/resource/imgs.png',
          'favoriteId': 7
        },
        {
          'id':11,
          'title':'dddd',
          'image':'/public/images/resource/imgs.png',
          'favoriteId': 9
        }
      ]

    });
  });

  server.get('/share', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data':
        {
          'entries':
            [
              {
                'price': 0.01,
                'name': '测试宝贝',
                'commission': 0,
                'id': 7,
                'defaultImage': 'http:\/\/fct-nick.img-cn-shanghai.aliyuncs.com\/upload\/images\/2017-07-19\/74d498ef6d884219816b34d50a1a9f88.jpg'
              },
              {
                'price': 99999,
                'name': '《寿桃》',
                'commission': 1000,
                'id': 6,
                'defaultImage': 'http:\/\/fct-nick.img-cn-shanghai.aliyuncs.com\/upload\/2017-06-13\/0e63189ca3b947a19d7ffb11e59a783e.jpg'
              },
              {
              'price': [8888, 9999],
              'name': 'goods',
              'commission': [200, 200],
              'id': 2,
              'defaultImage': 'http:\/\/fct-nick.img-cn-shanghai.aliyuncs.com\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png'
              },
              {
              'price': 120000,
              'name': '《天心月圆》',
              'commission': 1000,
              'id': 5,
              'defaultImage': 'http:\/\/fct-nick.img-cn-shanghai.aliyuncs.com\/upload\/2017-06-12\/ccdabaaeec514f1ba17905d683172d22.jpg'
              }
            ],
          'pager': {'prev': 0, 'current': 1, 'next': 1, 'page_size': 20, 'total_page': 1, 'total': 4}
        },

    });
  });

  server.post('/search', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': _data
    });
  });

  server.post('/saveAddress', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': _data
    });
  });

  server.post('/authentication', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': _data
    });
  });

  server.post('/getCoupon', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log('服务器接收到的数据：　'+decodeURIComponent(data));

    });
    req.on('end',function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': _data
    });
  });


  server.use(router);
  server.listen(3000, () => {
    console.log('JSON Server is running')
  });
  /* json-server end */


  runSequence(['clean'], ['styles', 'scripts', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app']
      }
    });

    // gulp.watch([
    //   'app/*.html',
    //   'app/public/images/**/*',
    //   '.tmp/public/fonts/**/*'
    // ]).on('change', reload);

    gulp.watch('app/public/styles/**/*.scss', ['styles']);
    gulp.watch('app/public/scripts/**/*.js', ['scripts']);
    gulp.watch('app/public/fonts/**/*', ['fonts']);
    // gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/public/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});

gulp.task('build_css', ['lint', 'html'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});
gulp.task('uglify_script', function() {
  // 1\. 找到文件
  gulp.src('.tmp/public/scripts/**/*.js')
    // .pipe($.concat('main.js'))
    // 2\. 压缩文件
    .pipe($.uglify())
    // 3\. 另存压缩后的文件
    .pipe(gulp.dest('dist/js'))

});

gulp.task('uglify_single_css', function() {
  gulp.src('app/public/styles/pay.css')
    .pipe($.cssnano())
    .pipe(gulp.dest('dist/styles'));

/*  gulp.src('app/public/styles/!*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe(reload({stream: true}))
    .pipe($.cssnano())
    .pipe(gulp.dest('dist/css'));*/


});
