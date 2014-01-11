/**
 * Dependencies
 */
var detector     = require('./detector');
var htmlSnapshot = require('./html-snapshot');
var fs   = require('fs');
var send = require('send');
var path = require('path');
var _    = require('lodash');

/**
 * Expose
 */
module.exports = function(options) {

  var options = _.defaults(options || {}, {
    url: null,
    verbose: false,
    encoding: 'utf-8',
    cacheDir: 'cache/'
  });

  try {
    fs.mkdirSync(options.cacheDir);
  } catch(e) {}

  return function (req, res, next) {
    var ua = req.headers['user-agent'] || '',
        isRecusiveCalling = ua.indexOf('Phantom') >= 0;

    if (!isRecusiveCalling && (detector.hasEscapedFragment(req) || detector.isRequestByCrawler(ua))) {

      var url   = req.protocol + '://' + req.headers.host + req.originalUrl,
          hash  = require('crypto').createHash('md5').update(url).digest('hex'),
          fpath = options.cacheDir + hash + (path.extname(url) || '.html'),
          rs, ws;

      // FIXME anti-pattern
      // @see http://nodejs.org/api/fs.html#fs_fs_exists_path_callback
      if (fs.existsSync(fpath)) {

        // 200 OK (Cache)
        res.header('X-Powered-By', 'cachedsnapshot');
        send(req, fpath).pipe(res);

      } else {

        options.url = url;

        rs = htmlSnapshot(options);
        ws = fs.createWriteStream(fpath);

        rs.on('error', function(code) {
          // assumed 404 NotFound
          res.header('X-Powered-By', 'htmlsnapshot');
          res.status(404);
          send(req, fpath).pipe(res);
        }).pipe(ws)

        ws.on('finish', function() {
          // 200 OK
          res.header('X-Powered-By', 'htmlsnapshot');
          send(req, fpath).pipe(res);
        });
      }

    } else {
      next();
    }
  }
};