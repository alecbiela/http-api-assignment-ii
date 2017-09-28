const userDB = require('./users.js');


// sends response back to client
const sendResponse = (req, res, data, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: userDB.getHash,
  };
  // write response using data passed in
  res.writeHead(status, headers);
  res.write(JSON.stringify(data));
  res.end();
};

// sends headers only back to the client
const sendResponseMeta = (req, res, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: userDB.getHash,
  };

    // send message without body
  res.writeHead(status, headers);
  res.end();
};


// gets users and returns them if the DB has not changed
const getUsers = (req, res) => {
  // check if we're trying to get the same file
  if (req.headers['if-none-match'] === userDB.getHash()) {
    // return 304 (not modified)
    return sendResponseMeta(req, res, 304);
  }

  // if not, send the users back
  return sendResponse(req, res, userDB.getUsers(), 200);
};

// gets meta data about the users object (no body)
const getUsersMeta = (req, res) => {
  // check if we're trying to get the same file
  if (req.headers['if-none-match'] === userDB.getHash()) {
    // return 304 (not modified)
    return sendResponseMeta(req, res, 304);
  }

  // if not, send 200 (success) back
  return sendResponseMeta(req, res, 200);
};

// updates a user in the DB
const updateUser = (req, res, body) => {
  // set up object, by default bad request
  const resObj = {
    message: 'Name and age are both required.',
  };

    // check to make sure that name AND age are defined
  if (!body.name || !body.age) {
    resObj.id = 'missingParams';
    return sendResponse(req, res, resObj, 400);
  }

  // add/update user
  // if this returns true, the added user was NEW, and should return 201 (created)
  // or else, return 204 (updated)
  if (userDB.updateUser(body.name, body.age)) {
    resObj.message = 'Created Successfully';
    return sendResponse(req, res, resObj, 201);
  }

  // 204 has no response data, so we just send head back
  return sendResponseMeta(req, res, 204);
};

// 404 (Not Found) with error message
const notFound = (req, res) => {
  const tmp = {
    message: 'The page you were looking for was not found.',
    id: 'notFound',
  };
  return sendResponse(req, res, tmp, 404);
};

// 404 (Not Found) with NO Message
const notFoundMeta = (req, res) => {
  sendResponseMeta(req, res, 404);
};

// export only calls to pages, not the inner workings
module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
