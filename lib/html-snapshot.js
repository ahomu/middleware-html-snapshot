/**
 * Dependencies
 */
var spawn = require('child_process').spawn;

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
function htmlSnapshot(options) {
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
    if (code > 0) {
      phantom.stdout.emit('error', code);
    }
  });

  return phantom.stdout;
}
