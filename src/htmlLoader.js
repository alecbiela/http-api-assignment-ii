const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const mycss = fs.readFileSync(`${__dirname}/../client/style.css`);

// returns index.html page
const getIndex = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

// returns style.css sheet
const loadCSS = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(mycss);
  res.end();
};

module.exports = {
  loadCSS,
  getIndex,
};
