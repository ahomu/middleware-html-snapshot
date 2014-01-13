var request = require('supertest'),
    express = require('express'),
    fs      = require('fs'),
    htmlSnapshot = require('../'),
    app;

app = express();
app.use(htmlSnapshot.connect())
app.use(express.static(__dirname + '/fixtures'))

describe('GET phantomjs content', function(){

  it('respond with static content', function(done){
    request(app)
      .get('/static.html')
      .set('User-Agent', 'googlebot')
      .expect(200)
      .expect(/Static Content/)
      .expect('X-Powered-By', 'htmlsnapshot')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        done();
      });
  });

  it('respond with dynamic content', function(done){
    request(app)
      .get('/dynamic.html')
      .set('User-Agent', 'googlebot')
      .expect(200)
      .expect(/Dynamic Content/)
      .expect('X-Powered-By', 'htmlsnapshot')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        done();
      });
  });

  it('respond with cached content from the 2nd time', function(done){
    var reqTwice = request(app);

    reqTwice
      .get('/dynamic.html')
      .set('User-Agent', 'googlebot')
      .expect(200)
      .end(function(err, res){

        reqTwice
          .get('/dynamic.html')
          .set('User-Agent', 'googlebot')
          .expect(200)
          .expect(/Dynamic Content/)
          .expect('X-Powered-By', 'cachedsnapshot')
          .end(function(err, res){
            if (err) {
              throw err;
            }
            done();
          });

      });
  });

  it('does not work snapshot when ua is not crawler', function(done) {
    request(app)
      .get('/dynamic.html')
      .expect(200)
      .expect('X-Powered-By', 'Express')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        done();
      });
  });

  it('request to notfound conent when return 404 status', function(done) {
    request(app)
      .get('/notfound.html')
      .set('User-Agent', 'googlebot')
      .expect(404)
      .expect('X-Powered-By', 'htmlsnapshot')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        done();
      });
  });

  it('request with escaped fragment', function(done) {
    request(app)
      .get('/escaped-fragment.html?_escaped_fragment_=abrahadbra')
      .set('User-Agent', 'googlebot')
      .expect(200)
      .expect(/Escaped Fragment/)
      .expect('X-Powered-By', 'htmlsnapshot')
      .end(function(err, res){
        if (err) {
          throw err;
        }
        done();
      });
  });

});