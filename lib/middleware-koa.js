/**
 * Dependencies
 */
var detector     = require('./detector');
var htmlSnapshot = require('./html-snapshot');

/**
 * Expose
 */
module.exports = function() {
  return function *(next) {
    var ctx = this,
        req = this.req,
        res = this.res;

    // TODO Implement

    if (detector.hasEscapedFragment(req) || detector.isRequestByCrawler(req)) {
      htmlSnapshot(req.url, function(snapshot) {
        ctx.body = snapshot;
      });
    } else {
      yield next;
    }
  }
};