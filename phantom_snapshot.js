var page = require('webpage').create();
var args = require('system').args;
var options = JSON.parse(args[1]);

page.viewportSize = {
  width: 1024,
  height: 768
};

page.onResourceReceived = function(response) {
  switch(response.status) {
    case 200:
      break;
    default:
      phantom.exit(1);
      break;
  }
};

page.onCallback = function() {
  console.log(page.content);
  phantom.exit();
};

page.open(options.url, function (status) {

  page.evaluate(function(timeout) {
    setTimeout(function() {
      window.callPhantom();
    }, timeout);
  }, options.timeout);

});