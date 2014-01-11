/**
 * Dependencies
 */
var detector     = require('./detector');
var htmlSnapshot = require('./html-snapshot');
var send = require('send');

/**
 * Expose
 */
module.exports = function(options) {

  return function (req, res, next) {

    var ua  = req.headers['user-agent'] || '',
        url = req.protocol + '://' + req.headers.host + req.originalUrl,
        isRecusiveCalling = ua.indexOf('Phantom') >= 0;

    if (!isRecusiveCalling && (detector.hasEscapedFragment(req) || detector.isRequestByCrawler(ua))) {

      options || (options = {});

      /**
       * @param {String} fpath
       * @param {Boolean} [cache]
       */
      options.success = function(fpath, cache) {
        // 200 OK
        if (cache) {
          res.header('X-Powered-By', 'cachedsnapshot');
        } else {
          res.header('X-Powered-By', 'htmlsnapshot');
        }
        send(req, fpath).pipe(res);
      };

      /**
       * @param {String} fpath
       * @param {String} [code]
       */
      options.error = function(fpath) {
        // assumed 404 NotFound
        res.header('X-Powered-By', 'htmlsnapshot');
        res.status(404);
        send(req, fpath).pipe(res);
      };

      htmlSnapshot(url, options);

    } else {
      next();
    }
  }
};