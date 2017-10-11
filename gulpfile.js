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
      ignore: ['vue.js','vue-router.js']
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
  return gulp.src('app/public/img/mobile/**/*')
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
            'couponCode': '',
            'status': 4,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
            'couponCode': '',
            'status': 3,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
            'couponCode': '',
            'status': 2,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
            'couponCode': '',
            'status': 1,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
            'couponCode': '',
            'status': 0,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
            'couponCode': '',
            'status': 4,                //used
            'statusName': '待收货',      //used
            'buyTotalCount': 10,        //used
            'payOrderId': null,
            'payPlatform': null,
            'remark': '',
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
        'pager': {'prev': 0, 'current': 1, 'next': 3, 'page_size': 20, 'total_page': 1, 'total': 13}
      }

    });
  });
  server.get('/artistPage', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '修改成功',
      'url': null,
      'data': {
          'entries':
              [
                /*{
                 'images':[],
                 'largeImages': [],
                 'videoImage':'//vjs.zencdn.net/v/oceans.png',
                 'videoUrl':'http://200006282.vod.myqcloud.com/200006282_42ca7ffa1e9011e692fe0785d455c86c.f20.mp4',
                 'id':1,
                 'content':'ssss',
                 'isTop': false
                 },*/
                  {
                      'images':
                          [
                              'http:\/\/fct-nick.img-cn-shanghai.aliyuncs.com\/upload\/2017-06-23\/8101370a8a1b48669c9a64f0f74264bc.png'
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test7.png',
                      ],
                      'videoImage':'\/images\/default-null.png',
                      'videoUrl':'',
                      'id':2,
                      'content':'ssss',
                      'isTop': true
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test1.png',
                              '/public/img/mobile/resource/test1.png',
                              '/public/img/mobile/resource/test1.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test2.png',
                          '/public/img/mobile/resource/test2.png',
                          '/public/img/mobile/resource/test2.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':5,
                      'content':'ssss',
                      'isTop': false
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test2.png',
                              '/public/img/mobile/resource/test2.png',
                              '/public/img/mobile/resource/test2.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test1.png',
                          '/public/img/mobile/resource/test1.png',
                          '/public/img/mobile/resource/test1.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':4,
                      'content':'ssss',
                      'isTop': false
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test3.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test4.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':7,
                      'content':'ssss',
                      'isTop': false
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test4.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test3.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':8,
                      'content':'ssss',
                      'isTop': false
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test5.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test6.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':9,
                      'content':'ssss',
                      'isTop': false
                  },
                  {
                      'images':
                          [
                              '/public/img/mobile/resource/test6.png',
                              '/public/img/mobile/resource/test6.png',
                          ],
                      'largeImages': [
                          '/public/img/mobile/resource/test5.png',
                          '/public/img/mobile/resource/test5.png',
                      ],
                      'videoImage':'//vjs.zencdn.net/v/oceans.png',
                      'videoUrl':'',
                      'id':10,
                      'content':'ssss',
                      'isTop': false
                  },
                /*{
                 'images': [],
                 'largeImages': [],
                 'videoImage':'//vjs.zencdn.net/v/oceans.png',
                 'videoUrl':'//vjs.zencdn.net/v/oceans.mp4',
                 'id':3,
                 'content':'组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件组件',
                 'isTop': false
                 }*/
              ],
        'pager': {'prev': 0, 'current': 1, 'next': 3, 'page_size': 20, 'total_page': 1, 'total': 13}
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
              'defaultImage': 'public/img/mobile/resource/pro01.png'
            },
            {
              'defaultImage': 'public/img/mobile/resource/pro01.png'
            },
            {
              'defaultImage': 'public/img/mobile/resource/pro01.png'
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
              'defaultImage': 'public/img/mobile/resource/pro01.png'
            },
            {
              'defaultImage': 'public/img/mobile/resource/pro01.png'
            },
            {
              'defaultImage': 'public/img/mobile/resource/pro01.png'
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
      'data': null

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
  server.get('/artistWorks', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '获取作品列表成功',
      'url': null,
      'data': [
        {
          'price': 0.01,
          'intro': '磊《《《《《《',
          'name': '测试宝贝',
          'id': 7,
          'defaultImage': 'http://fct-nick.img-cn-shanghai.aliyuncs.com/upload/2017-06-13/47325a6330324ebf927d44dae219f8f9.jpg'
        },
        {
          'price': 8888,
          'intro': '采用了原矿黑泥制作而成，壶容量为400cc，细观此壶，壶身犹若玉璧，精致美观，弯流壶嘴，暗接精湛无痕，出水流利',
          'name': 'goods',
          'id': 2,
          'defaultImage': 'http://fct-nick.img-cn-shanghai.aliyuncs.com/upload/2017-06-08/5f2a876426944448866798b34f08c43f.png'
        },
        {
          'price': 120000,
          'intro': '此壶采用了原矿紫泥制作而成，壶容量为410cc，壶身饱满有度，略呈半月形，壶盖微鼓，盖上壶钮雕成月圆形状，与壶身底部贴塑的花纹上下相应。',
          'name': '《天心月圆》',
          'id': 5,
          'defaultImage': 'http://fct-nick.img-cn-shanghai.aliyuncs.com/upload/2017-06-12/ccdabaaeec514f1ba17905d683172d22.jpg'
        }
      ]
    });
  });
  server.get('/artistChat', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '获取评论列表成功',
      'url': null,
      'data': {
        'entries': [
          {
            'createTime': '2017-07-07',
            'id': 2,
            'replyContent': [],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for BSD flavours'
          },
          {
            'createTime': '2017-07-07',
            'id': 1,
            'replyContent': [
              '回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复'
            ],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for Ubuntu'
          },
          {
            'createTime': '2017-07-07',
            'id': 2,
            'replyContent': [],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for BSD flavours'
          },
          {
            'createTime': '2017-07-07',
            'id': 1,
            'replyContent': [
              '回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复'
            ],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for Ubuntu'
          },
          {
            'createTime': '2017-07-07',
            'id': 2,
            'replyContent': [],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for BSD flavours'
          },
          {
            'createTime': '2017-07-07',
            'id': 1,
            'replyContent': [
              '回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复'
            ],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for Ubuntu'
          },
          {
            'createTime': '2017-07-07',
            'id': 2,
            'replyContent': [],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for BSD flavours'
          },
          {
            'createTime': '2017-07-07',
            'id': 1,
            'replyContent': [
              '回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复'
            ],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for Ubuntu'
          },
          {
            'createTime': '2017-07-07',
            'id': 2,
            'replyContent': [],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for BSD flavours'
          },
          {
            'createTime': '2017-07-07',
            'id': 1,
            'replyContent': [
              '回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复回复'
            ],
            'userName': 'jon',
            'headPortrait': '/img/mobile/default-null.png',
            'content': 'Virtual machine templates for Ubuntu'
          }
        ],
        'pager': {
          'prev': 0,
          'current': 1,
          'next': 1,
          'page_size': 20,
          'total_page': 1,
          'total': 2
        }
      }
    });
  });
  server.get('/encydetail28', (req, res) => {
    //得到键值对
    var arg1=url.parse(req.url,true).query;
    //打印键值对中的值
    console.log(arg1.name);
    res.json({
      'code': 200,
      'message': '获取评论列表成功',
      'url': null,
      'data': {
        'intro': '紫泥属泥质粉砂岩，目前仅产于丁蜀镇黄龙山矿区，一般产于甲泥矿层的中、上部位，质地比较均匀，以多种夹层的形式存在。矿层呈“薄层状”、“透镜状”等形态，泥层厚度一般在数十厘米到一米左右，有的仅数厘米，稳定性差，有时不延续而灭尖。',
        'name': '紫砂矿料·紫泥',
        'image': 'https:\/\/cdn.fangcun.com\/upload\/images\/2017-08-01\/f4c9613452bd4f16b30678f563c290a8.jpg!120',
        'description': '<p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>紫泥属泥质粉砂岩，目前仅产于丁蜀镇黄龙山矿区，一般产于甲泥矿层的中、上部位，质地比较均匀，以多种夹层的形式存在。矿层呈“薄层状”、“透镜状”等形态，泥层厚度一般在数十厘米到一米左右，有的仅数厘米，稳定性差，有时不延续而灭尖。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>紫泥古时也称“青泥”，是制作各种紫砂器最主要的原料，也是历史作品中最常见的泥料品种。紫泥原料可塑性好，泥坯强度高，干燥、烧成收缩小，具有优良的工艺性能。紫泥矿料的种类很多，根据开采矿区及矿层的区别，具有多种不同的外观特征及烧成效果。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>四号矿井白麻子紫泥<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>在矿层中偶然出现，含矿量极少。矿料外观呈紫褐色致密块状，易碎略坚硬，含有少量的白色云母碎片，矿料上有较多的白色麻点状。熟泥可塑性较好，成型时略酥，制作时带有泥沙性，烧成温度范围较宽。一般烧成1200～1240℃左右，收缩率4%左右。烧成后呈褐紫红色调，胎质纯正温润，表面黄白色的砂点颗粒丰富而自然，色泽浑朴古雅。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/e2a07261dec1d5d8.jpg\' alt=\'\' width=\'500\' height=\'284\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/52c6c59a06f76651.jpg\' alt=\'\' width=\'500\' height=\'332\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>秦韵 &nbsp;四号矿井白麻子紫泥 &nbsp;36目 1210℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/25119453a7daff90.jpg\' alt=\'\' width=\'500\' height=\'330\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>新韵 &nbsp;四号矿井白麻子紫泥 &nbsp;60目 1240℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>四号矿井紫泥<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>矿料外观呈紫褐色致密块状，比较坚硬，含有一定量的白色云母碎片，矿料上有青绿色的豆斑、斑纹状及紫黑色的条纹花斑状。熟泥可塑性一般，成型时略酥，制作时带有一定沙性，烧成温度范围较宽。一般烧成1180～1240℃左右，收缩率4%左右。烧成后呈紫棕红色调，胎质中颗粒隐现，色泽纯正明润，外观效果十分丰富。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/b4f330338b4cbf48.jpg\' alt=\'\' width=\'500\' height=\'320\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/31f91d6292c2dbe1.jpg\' alt=\'\' width=\'500\' height=\'341\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>掇只 &nbsp;四号矿井紫泥 &nbsp;40目 1210℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/cb7429e1c52e605f.jpg\' alt=\'\' width=\'500\' height=\'320\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>乳鼎 &nbsp;四号矿井紫泥 &nbsp;40目 1230℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>台西矿区紫泥（中层）<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>产于台西村露天矿。矿料外观呈紫红、紫褐色致密块状，比较坚硬，含有一定量的白色云母碎片，矿料上有淡绿色的斑点、斑纹状及紫黑色的花斑状。熟泥可塑性一般，成型时略酥，制作时带有一定沙性，烧成温度范围较宽。一般烧成1190～1220℃左右，收缩率4%左右。烧成后呈紫棕红色调，胎质颗粒隐现，色泽效果比较丰富。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/f5161c97e5a1a312.jpg\' alt=\'\' width=\'500\' height=\'352\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/04e19e3c8aaf4c9c.jpg\' alt=\'\' width=\'500\' height=\'316\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>天韵 &nbsp;台西矿区紫泥（中层） 40目 1220℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/8b347670f2e91ec7.jpg\' alt=\'\' width=\'500\' height=\'326\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>汉铎 &nbsp;台西矿区紫泥（中层） 40目 1230℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>天青泥<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>产于蠡墅大水潭北侧向西一百多米处。矿料外观质地均匀细腻，呈紫褐微透红色致密块状，易碎略坚硬，白色云母碎片含量极少，表面呈贝壳纹理状，有白色腊质状（烧成后会形成白点状），断面呈紫黑微透红色。前人因这种矿料颜色与天青染色料相似，故习惯称为“天青泥”。熟泥比较细腻，可塑性较好，成型制作时带有一定泥沙性，烧成温度范围较宽。一般烧成1160～1210℃左右，收缩率8%左右。烧成后呈深猪肝色，表面呈细梨皮状，胎质细密坚润，色泽效果细腻而丰富。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>天青泥贴层是梨皮泥，烧成后呈梨冻色，和《阳羡茗壶系》中记载：“天青泥出蠡墅，陶之变黯肝色，又其夹支有梨皮泥，陶现梨冻色。”完全吻合。光绪八年《宜兴县志》记载：“天青泥于诸泥最贵，制茗壶者特用之”。天青泥在古时就不多见，现代更是久已不见。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/162ed7665ea14059.jpg\' alt=\'\' width=\'500\' height=\'323\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/41fa0827f9e18cfa.jpg\' alt=\'\' width=\'500\' height=\'363\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>仿鼓 &nbsp;天青泥 &nbsp;60目 1190℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>青灰紫泥<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>和天青泥同矿层产出。矿料外观呈灰紫褐色致密块状，比较坚硬，含有少量微细的白色云母碎片，矿料上有淡绿色的豆斑状，表面呈纹理状。熟泥比较细腻，可塑性较好，成型制作时带有一定泥沙性，烧成温度范围一般。一般烧成1180～1200℃左右，收缩率6%左右。烧成后呈褐紫泛青灰色调，胎质呈细梨皮状，质坚而致密，表面纯正光润，色泽效果细腻而丰富。经一定的高温呈紫黑色调。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/50f7b23ef34b6456.jpg\' alt=\'\' width=\'500\' height=\'345\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/c6d115e1b8a404bc.jpg\' alt=\'\' width=\'500\' height=\'391\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>掇球 &nbsp;青灰紫泥 &nbsp;60目 1190℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>台西矿区中层紫泥（黑星紫泥）<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>产于台西村露天矿。矿料外观呈褐紫红色致密块状，易碎较坚硬，含有一定量的黑云母及较多的白色云母碎片，矿料上有青绿色的条纹、花斑纹。烧成后矿料中的黑云母能在胎质表面呈现出非常密集的黑色颗粒质点。熟泥可塑性略差，成型时较酥，制作时带有一定沙性，烧成温度范围较宽。一般烧成温度1170～1200℃左右，收缩率3.5%左右。烧成后胎质细腻光润，古朴典雅。根据烧成温度的不同，胎质呈色越浅，黑星颗粒的呈现就愈明显。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/9874e4fac2942b23.jpg\' alt=\'\' width=\'500\' height=\'355\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/0e78ca7102631701.jpg\' alt=\'\' width=\'500\' height=\'389\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>乳鼎 &nbsp;台西矿区中层紫泥（黑星紫泥） &nbsp;40目 1185℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>台西矿区中层紫泥（铁砂紫泥）<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>产于台西村露天矿。矿料外观呈灰褐色致密块状，比较坚硬，含有少量的白色云母碎片，矿料上有青绿色的豆斑状。熟泥可塑性一般，成型时较酥，制作时带有一定沙性，烧成温度范围较宽。一般烧成1190～1220℃左右，收缩率4%左右。烧成后胎质中隐隐透出黄色和黑砂质点。因矿料中含有较多的针铁矿等成分，会在表面产生黑色的微小熔孔，形成灰褐色的表面微细铁质斑点隐现，色泽效果十分丰富。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/dbf4cec63a0f8806.jpg\' alt=\'\' width=\'500\' height=\'313\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/255eb08922a4c9d9.jpg\' alt=\'\' width=\'500\' height=\'396\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>乳鼎 &nbsp;台西矿区中层紫泥（铁砂紫泥）36目 1210℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'margin: 0px; padding: 0px; border: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none;\'><span style=\'font-weight: 700;\'>宝山矿区嫩紫泥<\/span><\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>宝山矿区嫩紫泥矿料外观呈紫褐色致密块状，易碎略坚硬，含有少量的白色云母碎片，宝山矿区嫩紫泥矿料上有紫黑色的花斑状，表面有锈片状。熟泥可塑性较好，成型时略酥，制作时带有泥沙性，烧成温度范围较宽。一般成1170-1220℃左右，收缩率5.5%左右。宝山矿区嫩紫泥烧成后呈紫红色调，胎质呈细梨皮状，砂质细密温润，色泽效果十分丰富。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/4f1b03d163ba4010.jpg\' alt=\'\' width=\'500\' height=\'338\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/47a829f5774440fb.jpg\' alt=\'\' width=\'500\' height=\'309\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>石瓢 &nbsp;宝山矿区嫩紫泥 &nbsp;60目 1180℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'><img src=\'http:\/\/pic.taohuren.com\/images\/article\/2016\/0922\/e708aef612b10c9c.jpg\' alt=\'\' width=\'500\' height=\'287\' title=\'\' align=\'\' style=\'margin: 0px 0px 0px 6px; padding: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; list-style: none; max-width: 650px;\'><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-align: center; text-indent: 2em;\'>虚扁 &nbsp;宝山矿区嫩紫泥 &nbsp;60目 1210℃<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'><span style=\'font-weight: 700;\'>青龙山甲泥矿红棕泥<\/span><\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>矿料外观呈紫棕色致密块状，质地比较坚脆，含有一定量的白色云母碎片，矿料上有淡绿色的条纹、花斑纹。熟泥可塑性较差，成型时易酥开、断裂，制作时沙性较重，烧成温度范围较宽。一般烧成1190～1220℃左右，收缩率4%左右。烧成后呈紫棕红色调，胎质比较干涩，色泽纯度较差，制品容易产生开裂等缺陷。经一定高温烧成后表面易产生油点等杂质。<\/p><p style=\'margin: 14px auto; padding: 0px; border: 0px; font-size: 14px; font-family: &quot;Microsoft YaHei&quot;, sans-serif; vertical-align: baseline; list-style: none; color: rgb(102, 102, 102); text-indent: 2em;\'>红棕泥不适宜单独成型，原来一般作为甲泥使用，或用作生产花盆之类产品。因其矿料中太钛量较高，能加深铁化合物的着色，故有部分矿料精选后被用作调配拼紫泥等。<\/p>',
        'id': 5,
        'productList': [{
          'name': '《寿桃》',
          'id': 6,
          'defaultImage': 'https:\/\/cdn.fangcun.com\/upload\/images\/2017-08-01\/3fc97e5c9dbf4d2481749a9d9b9b5033.jpg!350'
        }]

      }
    });
  });


  server.post('/uploadFile', (req, res) => {
    res.json({
      'code': 200,
      'message': '获取成功',
      'url': null,
      'data': {
        'url': '/public/img/mobile/resource/artist.png',
        'fullUrl': 'http://localhost:9000/public/img/mobile/resource/artist.png'
      }
    });
  });
  server.post('/uploadReturnImg', (req, res) => {
    res.json({
      'code': 200,
      'message': '获取成功',
      'url': null,
      'data': {
        'url': '/public/img/mobile/resource/artist.png',
        'fullUrl': 'http://localhost:9000/public/img/mobile/resource/artist.png'
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
      'data': ''
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
    //   'app/public/img/mobile/**/*',
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
