const crypto = require('crypto');

const users = {};
let etag = '';
let digest = '';

// updates a user in the data
// if the user does not exist, make a new one with that age
// Once altered, update the digest
// RETURNS: Whether the user was a new entry or not (t/f)
const updateUser = (name, age) => {
  const newUser = !(users[name]);
  users[name] = { age };
  etag = crypto.createHash('sha1').update(JSON.stringify(users));
  digest = etag.digest('hex');
  return newUser;
};

// gets the object full of current users
const getUsers = () => users;

// gets the current hash
const getHash = () => digest;

// only want to be able to update the user and get object back
module.exports = {
  updateUser,
  getUsers,
  getHash,
};
