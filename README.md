#middleware-html-snapshot [![Build Status](https://travis-ci.org/ahomu/middleware-html-snapshot.png?branch=master)](https://travis-ci.org/ahomu/middleware-html-snapshot)

Provide generating html snapshot (Connect and Koa, support as middleware)

##Installation

```
$ npm install middleware-html-snapshot
```

##Example

```
var app = require('express')();
var snapshot = require('middleware-html-snapshot');

app.use(snapshot.connect());
```

```
// full options
app.use(snapshot.connect({
  url     : null,
  verbose : false,
  encoding: 'utf-8',
  cacheDir: 'cache/',
  timeout : 2000
}));

```

##License

MIT