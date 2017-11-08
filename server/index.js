const
  express = require('express')
  , crypto = require('crypto')
  , path = require('path')
;

let
  app = express()
  , wxjssdk = require('weixinjssdk')
  , port = process.env.PORT || 3000
;

const token = 'cycjimmy';

let handleWechatRequst = (req, res, next) => {
  let
    {signature, timestamp, nonce, echostr} = req.query
  ;

  if (!signature || !timestamp || !nonce) {
    return res.send('invalid request');
  }

  if (req.method === 'POST') {
    console.log('handleWechatRequst.post:', {body: req.body, query: req.query});
  }

  if (req.method === 'GET') {
    console.log('handleWechatRequst.get:', {body: req.body});
    if (!echostr) {
      return res.send('invalid request');
    }
  }

  let params = [token, timestamp, nonce];
  params.sort();
  let hash = crypto.createHash('sha1');
  let sign = hash.update(params.join('')).digest('hex');

  if (signature !== sign) {
    res.send('invaid sign');
  }

  if ('GET' === req.method) {
    res.send(echostr ? echostr : 'invaid sign');
  } else {
    let postdata='';
    req.addListener("data",(postchunk)=>{
      postdata += postchunk;
    });

    req.addListener("end",function(){
      console.log(postdata);
      res.send('success');
    });
  }
};


// static
app.use('/static', express.static(path.resolve('static')));

// set api
app.get('/api', (req, res) => {
  res.send('mock api');
});

app.get('/api/wxJssdk', (req, res) => {
  let
    _getUrl = req => req.protocol + '://' + req.headers.host + req.originalUrl.split('#')[0]
  ;

  wxjssdk({
    appid: 'wxcc6445076f2002c3',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    url: _getUrl(req)
  })
    .then(data => {
      res.send(data);
    }, (err) => {
      res.send(err);
    });
});

// wxVerify
app.get('/api/wxVerify', handleWechatRequst);
app.post('/api/wxVerify', handleWechatRequst);

app.listen(port, () => {
  console.log('App is listening at port ' + port + '!');
});