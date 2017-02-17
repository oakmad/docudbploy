const elegantStatus = require('elegant-status');
const utils = require('./utils');

module.exports = {
  upsertSP(client, collection, sp, env) {
    const step = elegantStatus(`[${env}]    Upserting sp ${sp.id} in ${collection.id}`);
    const sproc = {
      id: sp.id,
      serverScript: sp.serverScript,
    };
    return client.upsertStoredProcedureAsync(collection._self, sproc)
      .then((response) => {
        step(true);
        return response;
      })
      .catch((err) => {
        step(false);
        utils.azureSaysNo(err);
      });
  },
  upsertTrig(client, collection, trig, env) {
    const step = elegantStatus(`[${env}]    Upserting trig ${trig.id} in ${collection.id}`);
    return client.upsertTriggerAsync(collection._self, trig.body, {})
      .then((response) => {
        step(true);
        return response;
      })
      .catch((err) => {
        step(false);
        utils.azureSaysNo(err);
      });
  },
  upsertUDF(client, collection, udf, env) {
    const step = elegantStatus(`[${env}]    Upserting udf ${udf.id} in ${collection.id}`);
    return client.upsertUserDefinedFunctionAsync(collection._self, udf.body, {})
      .then((response) => {
        step(true);
        return response;
      })
      .catch((err) => {
        step(false);
        utils.azureSaysNo(err);
      });
  },
  getCreateDatabase(client, databaseId, env) {
    const step = elegantStatus(`[${env}]    Checking database ${databaseId}`);
    const querySpec = {
      query: 'SELECT * FROM root r WHERE  r.id = @id',
      parameters: [
        {
          name: '@id',
          value: databaseId,
        },
      ],
    };
    return client.queryDatabases(querySpec).toArrayAsync()
      .then((results) => {
        if (results.feed.length === 0) {
          let databaseSpec = {
            id: databaseId,
          };
          return client.createDatabaseAsync(databaseSpec)
            .then((response) => {
              step(true);
              // console.log(response);
              return response.resource;
            });
        }
        step(true);
          // console.log(results);
        return results.feed[0];
      })
      .catch((err) => {
        step(false);
        utils.azureSaysNo(err);
      });
  },
  getCreateCollection(client, databaseLink, collectionId, env) {
    const step = elegantStatus(`[${env}]    *  Checking collection ${collectionId}`);
    const querySpec = {
      query: 'SELECT * FROM root r WHERE  r.id = @id',
      parameters: [
        {
          name: '@id',
          value: collectionId,
        },
      ],
    };
    return client.queryCollections(databaseLink, querySpec).toArrayAsync()
      .then((results) => {
        if (results.feed.length === 0) {
          return client.createCollectionAsync(databaseLink, { id: collectionId })
            .then((response) => {
              // console.log(response.resource);
              step(true);
              return response.resource;
            });
        }
        step(true);
        return results.feed[0];
      })
      .catch((err) => {
        step(false);
        utils.azureSaysNo(err);
      });
  },
};
