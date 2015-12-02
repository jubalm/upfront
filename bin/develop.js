var nodemon = require('nodemon');
var sass = require('node-sass');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var sync = require('browser-sync').create();
var logger = require('./logger')();

// nodemon
nodemon({
  'script': 'index',
  'ignore': 'public',
  'ext': 'js',
  'colours': true
});

nodemon.on('start', function() {
    logger.info('Application started');
  })
  .on('quit', function() {
    logger.info('Exiting app...');
  })
  .on('restart', function(files) {
    logger.info('Restarting app in behalf of updates..');
    logger.check(files[0]);
  });

// browser sync
sync.init({
  files: ['public'],
  proxy: 'localhost:' + process.env.APP_PORT || '1337',
  open: false
});

// watch sass files
sync.watch('**/*.scss')
  .on('change', function(file) {

    buildSass(function() {
      sync.reload('*.css');
    });

  });

function buildSass(callback) {

  var config = {
    src: 'public/styles/sources/*.scss',
    dest: 'public/styles'
  };

  glob(config.src, function(err, files) {

    if (!files.length) {
      logger.error('{grey:Sass:} Cannot open sources!');
      return;
    }

    files.forEach(function(file) {

      var srcfile = path.parse(file).name,
        destfile = path.join(config.dest, srcfile + '.css'),
        sassOptions = {
          file: file,
          outfile: destfile
        };

      // skip underscore files
      if (srcfile.indexOf('_') === 0) return;

      sass.render(sassOptions, function(err, result) {
        if (!err) {
          fs.writeFile(destfile, result.css, function(err) {
            if (err) {
              logger.error('Unable to write file' + file);
              return;
            }
            logger.check(destfile);
          });
          return;
        }
        logger.error('Sass parser encountered an error');
        logger.log(err.message);
      });

    });

  });

  callback();

}
