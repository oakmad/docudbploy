const elegantStatus = require('elegant-status');
const json = require('jsonfile');
const utils = require('./utils');

const initialize = function () {
  const done = elegantStatus('Creating configurtaion file: docudbploy.json');
  if (utils.configPath()) {
    done(false);
    throw new Error(`Already initialized! Config found ${utils.configPath()}`);
  }
  const settings = {
    globs: ['*.js'],
    ignore: ['docudbploy.json'],
    env: [
      {
        id: 'prod',
        endpointUri: '<your endpoint URI>',
        primaryKey: '<endpoint primary key>',
        database: '<database name>',
        collections: ['<collection name>'],
        deploy: true,
        autoDeploy: false,
        globs: ['*.js'],
        ignore: ['docudbploy.json'],
      },
    ],
  };
  json.writeFileSync('docudbploy.json', settings, { spaces: 2 });
  done(false);
};

module.exports = initialize;
