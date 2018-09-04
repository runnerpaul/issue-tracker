var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var gulpMocha = require('gulp-mocha');
var env = require('gulp-env');
//var supertest = require('supertest');

gulp.task('default', function() {
  var stream = nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      PORT: 5050
    },
    ignore: ['./node_modules/**']
  });
  process.env.ENV = 'dev';

  //var logger = require('./modules/logging');

  stream.on('restart', function() {
    //logger.info('Gulp restarted');
    //console.info('Gulp restarted');
  }).on('crash', function() {
    //logger.error('Application has crashed!');
    //console.error('Application has crashed!');
    setTimeout(function() {
      stream.emit('restart', 5); // restart the server in 5 seconds
    }, 5000);
  });
});

gulp.task('dev', function() {
  var stream = nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      ENV: 'dev',
      PORT: 5051
    },
    ignore: [
      './node_modules/**',
      './workload/**'
    ]
  });
  process.env.ENV = 'dev';

  //var logger = require('./modules/logging');

  stream.on('restart', function() {
    console.log('Gulp restarted');
    //logger.info('Gulp restarted');
    //console.info('Gulp restarted');
  }).on('crash', function() {
    console.log('Application has crashed');
    //logger.error('Application has crashed!');
    //console.error('Application has crashed!');
    setTimeout(function() {
      stream.emit('restart', 5); // restart the server in 5 seconds
    }, 5000);
  });
});

gulp.task('sandbox', function() {
  var stream = nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      PORT: 5050
    },
    ignore: ['./node_modules/**']
  });
  process.env.ENV = 'sandbox';

  //var logger = require('./modules/logging');

  stream.on('restart', function() {
    //logger.info('Gulp restarted');
    //console.info('Gulp restarted');
  }).on('crash', function() {
    //logger.error('Application has crashed!');
    //console.error('Application has crashed!');
    setTimeout(function() {
      stream.emit('restart', 5); // restart the server in 5 seconds
    }, 5000);
  });
});

gulp.task('production', function() {
  var stream = nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      ENV: 'production',
      PORT: 5050
    },
    ignore: ['./node_modules/**']
  });
  process.env.ENV = 'production';

  //var logger = require('./modules/logging');

  stream.on('restart', function() {
    //logger.info('Gulp restarted');
    //console.info('Gulp restarted');
  }).on('crash', function() {
    //logger.error('Application has crashed!');
    //console.error('Application has crashed!');
    setTimeout(function() {
      stream.emit('restart', 5); // restart the server in 5 seconds
    }, 5000);
  });
});

gulp.task('test', function() {
  env({
    vars: {
      ENV: 'test'
    }
  })

  gulp.src('tests/*.js', {
      read: false
    })
    .pipe(gulpMocha({
      reporter: 'nyan'
    }));
});

