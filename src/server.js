const http = require('http');
const htmlHandler = require('./htmlLoader.js');
const queryString = require('querystring');
const responses = require('./responses.js');
const url = require('url');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handles HEAD
const handleHead = (req, res, pUrl) => {
  // route to correct URL
  switch (pUrl.pathname) {
    case '/getUsers':
      responses.getUsersMeta(req, res);
      break;
    default:
      responses.notFoundMeta(req, res);
      break;
  }
};

// handles GET
const handleGet = (req, res, pUrl) => {
  // route to correct URL
  switch (pUrl.pathname) {
    case '/style.css':
      htmlHandler.loadCSS(req, res);
      break;
    case '/getUsers':
      responses.getUsers(req, res);
      break;
    case '/':
      htmlHandler.getIndex(req, res);
      break;
    default:
      responses.notFound(req, res);
      break;
  }
};

// handles POST
const handlePost = (req, res, pUrl) => {
  // post only if we are going to /addUser
  if (pUrl.pathname === '/addUser') {
    // read in the body
    const body = [];

    // handle errors with 400 (bad request), print in server
    req.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // when data chunks come in, add them to the body
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    // at the end, put the body into one large string
    req.on('end', () => {
      const bodyStr = Buffer.concat(body).toString();
      const bodyParams = queryString.parse(bodyStr);

      // now process the user
      responses.updateUser(req, res, bodyParams);
    });
  } else {
    // respond with 404 META (post request, no body returned)
    responses.notFoundMeta(req, res);
  }
};


// handles requests
const onRequest = (req, res) => {
  // parse URL and get params
  const parsedUrl = url.parse(req.url);

  // decide how to handle request based on method
  if (req.method === 'POST') handlePost(req, res, parsedUrl);
  else if (req.method === 'GET') handleGet(req, res, parsedUrl);
  else if (req.method === 'HEAD') handleHead(req, res, parsedUrl);
};

// create server and start listening
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
