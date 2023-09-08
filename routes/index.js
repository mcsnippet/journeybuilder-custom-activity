const path = require('path');
const fs = require('fs');

/**
 * Render Config
 * @param req
 * @param res
 */

// JL define two route handler functions: config and ui.

exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  const file = path.join(__dirname, '..', 'public', 'config-template.json'); // JL used in the 'path.join' function to navigate up one directory level.

  /* 
  Reads the content of a file synchronously using the Node.js fs (file system) module and stores the content in the configTemplate variable.
  fs: This is the Node.js built-in module for interacting with the file system, allowing you to read, write, and manipulate files.
  */
  const configTemplate = fs.readFileSync(file, 'utf-8');
  const config = JSON.parse(configTemplate.replace(/\$DOMAIN/g, domain));
  res.json(config);
};

/**
 * Render UI
 * @param req
 * @param res
 */

/*
This function handles requests to the root URL ("/"), likely serving the user interface (UI) of your custom activity.
It uses the res.render method to render a view named "index" (presumably a Pug template) and pass some data to it.
*/
exports.ui = (req, res) => {
  res.render('index', {
    title: 'Custom Activity',
    dropdownOptions: [
      {
        name: 'Journey Entry',
        value: 'journeyEntry',
      },
      {
        name: 'Journey Exit',
        value: 'journeyExit',
      },
    ],
  });
};
