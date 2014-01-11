/**
 * Expose
 */
var GENERATOR_AVAILABLE = process.version.slice(1).split('.')[1] >= 11 && process.execArgv.join().indexOf('--harmony') > 0;
module.exports = {
  // app.use(htmlSnapshot.express());
  express: require('./lib/middleware-express'),

  // experimental support
  // app.use(htmlSnapshot.koa());
  koa: GENERATOR_AVAILABLE ? require('./lib/middleware-koa') : null
};