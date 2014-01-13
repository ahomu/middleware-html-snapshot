/**
 * Dependencies
 */
var spawn = require('child_process').spawn;
var fs    = require('fs');
var path  = require('path');
var _     = require('lodash');

/**
 * Expose
 */
module.exports = htmlSnapshot;

/**
 * Html Snapshot
 * @param {String} url
 * @param {Object} [options]
 * @return {ReadableStream}
 */
function htmlSnapshot(url, options) {

  var options = _.defaults(options, {
    url     : null,
    verbose : false,
    encoding: 'utf-8',
    cacheDir: 'cache/',
    timeout : 2000,
    /**
     * @param {String} fpath
     * @param {Boolean} [cache]
     */
    success : function(fpath) { throw Error('should be implement `success` handler'); },
    /**
     * @param {String} fpath
     */
    error   : function(fpath) { throw Error('should be implement `error` handler'); }
  });

  var hash  = require('crypto').createHash('md5').update(url).digest('hex'),
      fpath = options.cacheDir + hash + (path.extname(url).split(/(\?|#)/)[0] || '.html'),
      rs, ws;

  try {
    fs.mkdirSync(options.cacheDir);
  } catch(e) {}

  // FIXME anti-pattern
  // @see http://nodejs.org/api/fs.html#fs_fs_exists_path_callback
  if (fs.existsSync(fpath)) {

    options.success(fpath, true);

  } else {

    options.url = url;

    rs = createPhantomStream(options);
    ws = fs.createWriteStream(fpath);

    rs.on('error',  _.bind(options.error,   this, fpath)).pipe(ws)
    ws.on('finish', _.bind(options.success, this, fpath));
  }
}

/**
 * @param {Object} options
 * @return {Stream}
 */
function createPhantomStream(options) {

  var phantom = spawn('phantomjs', [
    '--load-images=no',
    __dirname + '/../phantom_snapshot.js',
    JSON.stringify(options)
  ]);

  phantom.stderr.on('data', function (data) {
    if (options.verbose) {
      console.log('stderr: ' + data);
    }
  });

  phantom.on('exit', function(code) {
    if (options.verbose) {
      console.log('child process exited with code ' + code);
    }
    if (code > 0 || code === null) {
      phantom.stdout.emit('error', code);
    }
  });

  return phantom.stdout;
}