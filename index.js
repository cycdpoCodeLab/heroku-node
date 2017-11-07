const
  express = require('express')
  , path = require('path')
;

let
  app = express()
  , port = process.env.PORT || 3000
;

// static
app.use('/static', express.static(path.resolve('static')));

// set api
app.get('/api', (req, res) => {
  res.send('mock api');
});

app.listen(port, () => {
  console.log('App is listening at port ' + port + '!');
});