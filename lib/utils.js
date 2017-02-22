const fs = require('fs');
const path = require('path');
const elegantStatus = require('elegant-status');
const json = require('jsonfile');
const _ = require('lodash');

module.exports = {
  azureSaysNo(err) {
    if (err.body) {
      // Strip out the messages
      let msg = JSON.parse(err.body).message;
      let msgStart = msg.indexOf('"Errors":') + 9;
      let msgEnd = msg.indexOf(']', msgStart) + 1;
      let errors = JSON.parse(msg.substring(msgStart, msgEnd));
      console.log(errors.join(' '));
    } else {
      console.log(err);
    }
  },

  directoryExists(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  confirmInitialized() {
    const step = elegantStatus('Checking for azdocdb.json');
    if (!this.configPath()) {
      step(false);
      throw new Error('Not initialized! Run "azdocdb init" in project root first');
    }
    step(true);
    return true;
  },

  getConfig() {
    if (!this.confirmInitialized()) { return false; }
    const step = elegantStatus('Reading config in azdocdb.json');
    const config = json.readFileSync(this.configPath());
    step(true);
    return config;
  },

  configPath: function search(root) {
    let chkPath = root || process.cwd();
    // walks up looking for azdocdb.json
    if (chkPath === path.sep) return false;
    const file = path.join(chkPath, 'azdocdb.json');
    chkPath = path.resolve(chkPath, '..');

    if (fs.existsSync(file)) {
      return file;
    }
    return search(chkPath);
  },

  validType(type) {
    return ['sp', 'trig', 'udf'].includes(type);
  },
};
