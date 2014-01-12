/**
 * Expose
 */
module.exports = {
  /**
   * @param {Request} req
   * @return {Boolean}
   */
  hasEscapedFragment: function(req) {
    return !!req.query['_escaped_fragment_'];
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