const fs = require('fs');
const elegantStatus = require('elegant-status');
const utils = require('./utils');
const camelCase = require('camelcase');

const create = function (type, name) {
  if (!utils.confirmInitialized()) { return; }
  const step2 = elegantStatus(`Creating skeleton ${type} ${name}`);

  if (utils.fileExists(name)) {
    step2.updateText(`${name} already exists`);
    step2(false);
    return;
  }

  const code = `
module.exports = {
  id: '${camelCase(name.replace(/\.[^/.]+$/, ''))}', //A unique ID for each object
  type: '${type || 'sp'}', //sp, trig or udf
  collections:['<collectionId>'], //Array of collections in which object is to be written, empty for all
  serverScript: function ${camelCase(name.replace(/\.[^/.]+$/, ''))}() {
      var context = getContext();
      var response = context.getResponse();

      response.setBody("Your logic goes here in the body");
  },
};`;
  fs.writeFile(name, code, (err) => {
    if (err) {
      step2.updateText(err);
      step2(false);
      return;
    }
    step2(true);
  });
};

module.exports = create;
