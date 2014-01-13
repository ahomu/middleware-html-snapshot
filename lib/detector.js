/**
 * Expose
 */
module.exports = {
  /**
   * @see https://developers.google.com/webmasters/ajax-crawling/docs/specification
   * @param {Request} req
   * @return {Boolean}
   */
  hasEscapedFragment: function(req) {
    if (!!req.query['_escaped_fragment_']) {

      // Remove from the URL all tokens beginning with _escaped_fragment_=.
      req.url = req.url.slice(0, req.url.indexOf('_escaped_fragment_='));

      // Remove from the URL the trailing ? or &
      req.url = req.url.replace(/(\?|&)$/, '')

      // Add to the URL the tokens #!
      req.url += '#!';

      // Add to the URL all tokens after _escaped_fragment_= after unescaping them.
      req.url += req.query['_escaped_fragment_'];

      delete req.query['_escaped_fragment_'];

      return true;
    } else {
      return false;
    }
  },

  /**
   * @param {String} ua
   * @return {Boolean}
   */
  isRequestByCrawler: function(ua) {
    return ua.indexOf('googlebot') !== -1
        || ua.indexOf('yahoo')     !== -1
        || ua.indexOf('bingbot')   !== -1
    ;
  }
}