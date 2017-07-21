// generated on 2017-06-07 using generator-webapp 3.0.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

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
      msg:"",
      data: slides
    });
  });
  server.post('/uploadFile', (req, res) => {
    res.json({
      "code": 200,
      "message": "获取成功",
      "url": null,
      "data": {
        "url": "/public/images/resource/artist.png",
        "fullUrl": "http://localhost:9000/public/images/resource/artist.png"
      }
    });
  });

  server.post('/userinfo', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log("服务器接收到的数据：　"+decodeURIComponent(data));

    });
    req.on("end",function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      "code": 200,
      "message": "修改成功",
      "url": null,
      "data": _data
    });
  });

  server.post('/orderlist', (req, res) => {
    var _data = {};
    req.on('data',function(data){
      _data += data;
      console.log("服务器接收到的数据：　"+decodeURIComponent(data));

    });
    req.on("end",function(){
      console.log('客户端请求数据全部接收完毕');
    });
    res.json({
      "code": 200,
      "message": "修改成功",
      "url": null,
      "data": {
        "entries": [
          {
            "orderId": "1707186898922467",      //used
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 0,
            "accountAmount": 4991.4,
            "cashAmount": 2563.4,
            "payAmount": 7554.8,      //used
            "totalAmount": 8888,
            "couponCode": "",
            "status": 4,                //used
            "statusName": "待收货",      //used
            "buyTotalCount": 10,        //used
            "payOrderId": null,
            "payPlatform": null,
            "remark": "",
            "orderGoods": [             //used
              {
                "id": 60,
                "orderId": "1707186898922467",
                "goodsId": 2,
                "goodsSpecId": 1,
                "name": "goods",
                "specName": "aaa",
                "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
                "buyCount": 1,
                "price": 8888,
                "commission": 200,
                "promotionPrice": 7554.8,
                "couponAmount": 0,
                "payAmount": 7554.8,
                "totalAmount": 8888,
                "content": null
              }
            ],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500376189000,
            "updateTime": 1500462600000,
            "expiresTime": 1500462589000,
            "finishTime": null,
            "operatorId": null
          },
          {
            "orderId": "1707186884123134",
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 0,
            "accountAmount": 4991.4,
            "cashAmount": 2563.4,
            "payAmount": 7554.8,
            "totalAmount": 8888,
            "couponCode": "",
            "status": 4,
            "payOrderId": null,
            "payPlatform": null,
            "remark": "",
            "orderGoods": [{
              "id": 59,
              "orderId": "1707186884123134",
              "goodsId": 2,
              "goodsSpecId": 1,
              "name": "goods",
              "specName": "aaa",
              "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
              "buyCount": 1,
              "price": 8888,
              "commission": 200,
              "promotionPrice": 7554.8,
              "couponAmount": 0,
              "payAmount": 7554.8,
              "totalAmount": 8888,
              "content": null
            }],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500376041000,
            "updateTime": 1500462600000,
            "expiresTime": 1500462441000,
            "finishTime": null,
            "operatorId": null
          },
          {
            "orderId": "1707186868491766",
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 0,
            "accountAmount": 4991.4,
            "cashAmount": 2563.4,
            "payAmount": 7554.8,
            "totalAmount": 8888,
            "couponCode": "",
            "status": 4,
            "payOrderId": null,
            "payPlatform": null,
            "remark": "",
            "orderGoods": [{
              "id": 58,
              "orderId": "1707186868491766",
              "goodsId": 2,
              "goodsSpecId": 1,
              "name": "goods",
              "specName": "aaa",
              "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
              "buyCount": 1,
              "price": 8888,
              "commission": 200,
              "promotionPrice": 7554.8,
              "couponAmount": 0,
              "payAmount": 7554.8,
              "totalAmount": 8888,
              "content": null
            }],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500375885000,
            "updateTime": 1500462300000,
            "expiresTime": 1500462285000,
            "finishTime": null,
            "operatorId": null
          },
          {
            "orderId": "1707176313104284",
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 0,
            "accountAmount": 7554.8,
            "cashAmount": 0,
            "payAmount": 7554.8,
            "totalAmount": 8888,
            "couponCode": "",
            "status": 1,
            "payOrderId": null,
            "payPlatform": "account",
            "remark": "第二个。",
            "orderGoods": [
              {
                "id": 57,
                "orderId": "1707176313104284",
                "goodsId": 2,
                "goodsSpecId": 1,
                "name": "goods",
                "specName": "aaa",
                "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
                "buyCount": 1,
                "price": 8888,
                "commission": 200,
                "promotionPrice": 7554.8,
                "couponAmount": 0,
                "payAmount": 7554.8,
                "totalAmount": 8888,
                "content": null
              }],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500283931000,
            "updateTime": 1500283932000,
            "expiresTime": 1500370331000,
            "finishTime": null,
            "operatorId": null
          },
          {
            "orderId": "1707176300449815",
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 10100,
            "accountAmount": 7453.8,
            "cashAmount": 0,
            "payAmount": 7554.8,
            "totalAmount": 8888,
            "couponCode": "",
            "status": 1,
            "payOrderId": null,
            "payPlatform": "account",
            "remark": "",
            "orderGoods": [{
              "id": 56,
              "orderId": "1707176300449815",
              "goodsId": 2,
              "goodsSpecId": 1,
              "name": "goods",
              "specName": "aaa",
              "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
              "buyCount": 1,
              "price": 8888,
              "commission": 200,
              "promotionPrice": 7554.8,
              "couponAmount": 0,
              "payAmount": 7554.8,
              "totalAmount": 8888,
              "content": null
            }],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500283804000,
            "updateTime": 1500283806000,
            "expiresTime": 1500370204000,
            "finishTime": null,
            "operatorId": null
          },
          {
            "orderId": "1707176136486431",
            "memberId": 5,
            "cellPhone": "18616311580",
            "shopId": 0,
            "points": 10100,
            "accountAmount": 7453.8,
            "cashAmount": 0,
            "payAmount": 7554.8,
            "totalAmount": 8888,
            "couponCode": "",
            "status": 1,
            "payOrderId": null,
            "payPlatform": "account",
            "remark": "",
            "orderGoods": [{
              "id": 55,
              "orderId": "1707176136486431",
              "goodsId": 2,
              "goodsSpecId": 1,
              "name": "goods",
              "specName": "aaa",
              "img": "\/upload\/2017-06-08\/5f2a876426944448866798b34f08c43f.png",
              "buyCount": 1,
              "price": 8888,
              "commission": 200,
              "promotionPrice": 7554.8,
              "couponAmount": 0,
              "payAmount": 7554.8,
              "totalAmount": 8888,
              "content": null
            }],
            "orderReceiver": null,
            "settleId": 0,
            "commentStatus": 0,
            "payTime": null,
            "createTime": 1500282164000,
            "updateTime": 1500282166000,
            "expiresTime": 1500368564000,
            "finishTime": null,
            "operatorId": null
          },

        ],
        "pager": {"prev": 0, "current": 1, "next": 1, "page_size": 20, "total_page": 1, "total": 13}
      }

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
