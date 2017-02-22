const elegantStatus = require('elegant-status');
const walkSync = require('walk-sync');
const _ = require('lodash');
const DocumentDBClient = require('documentdb-q-promises').DocumentClientWrapper;
const utils = require('./utils');
const db = require('./db');
const Q = require('q');

const watch = function (target) {
  const config = utils.getConfig();
  if (target && _.filter(config.env, env => env.id === target).length === 0) {
    throw new Error(`Unable to find config for env id: ${target}`);
  }
  config.env.forEach((env) => {
    if ((!target || env.id === target) && env.deploy) {
      // connect to database
      const stepConn = elegantStatus(`[${env.id}]    Connecting to endpointUri`);
      const client = new DocumentDBClient(env.endpointUri, { masterKey: env.primaryKey });
      stepConn(true);
      db.getCreateDatabase(client, env.database, env.id)
      .then((database) => {
        // let collections = [];
        let promises = [];
        // console.log(database);
        env.collections.forEach((coll) => { // Ensure each collection
          promises.push(db.getCreateCollection(client, database._self, coll, env.id)
          .then(collection => collection));
        });
        // /Try promises
        return Q.all(promises)
          .then(response => response);
      })
      .then((collections) => {
        const step = elegantStatus(`[${env.id}]    ${collections.length} collections OK`);
        step(true);
        const stepWlk = elegantStatus(`[${env.id}]    Gathering files`);
        const walkopt = {
          directories: false,
          globs: _.merge(config.globs, env.globs),
          ignore: _.merge(config.ignore, env.ignore),
        };
        const walkpth = utils.configPath().slice(0, -13); // strip azdocdb.json/
        const list = walkSync(walkpth, walkopt);
        stepWlk(true);
        let fileProm = [];
        list.forEach((file) => {
          const o = require(`${walkpth}/${file}`);
          collections.forEach((collection) => {
            if (o.collections.length === 0 || o.collections.includes(collection.id)) {
              switch (o.type) {
                case 'sp':
                  fileProm.push(db.upsertSP(client, collection, o, env.id));
                  break;
                case 'trig':
                  fileProm.push(db.upsertTrig(client, collection, o, env.id));
                  break;
                case 'udf':
                  fileProm.push(db.upsertUDF(client, collection, o, env.id));
                  break;
                default:
                  throw new Error(`Unknown type ${o.type}`);
              }
            }
          });
        });
        return Q.all(fileProm)
               .then((resp) => {
                 const fin = elegantStatus(`[${env.id}]    Finished.`);
                 fin(true);
               });
      })
      .catch((err) => {
        utils.azureSaysNo(err);
      });
    }
  });
};

module.exports = watch;
