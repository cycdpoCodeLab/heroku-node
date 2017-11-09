const
  express = require('express')
  , path = require('path')
;

let
  app = express()
  , wxjssdk = require('weixinjssdk')
  , port = process.env.PORT || 3000
;

const token = 'cycjimmy';

// static
app.use('/static', express.static(path.resolve('static')));

// set api
app.get('/api', (req, res) => {
  res.send('mock api');
});

// API: wxJssdk
app.get('/api/wxJssdk', (req, res) => {
  wxjssdk({
    appid: 'wxcc6445076f2002c3',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    url: wxjssdk.getUrl(req)
  })
    .then(data => {
      res.send(data);
    }, (err) => {
      res.send(err);
    });
});

// wxVerify
app.get('/api/wxVerify', wxjssdk.handleServerVerify(token));
app.post('/api/wxVerify', wxjssdk.handleServerVerify(token));

app.listen(port, () => {
  console.log('App is listening at port ' + port + '!');
});

