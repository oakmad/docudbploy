# DocuDbPloy

A helper application for deploying DocumentDb databases, collections and server scripts (stored procedures, triggers and user defined functions).
Designed to handle both the creation and updating on deploy. A work in progress; issues are welcome.

## Getting Started

Designed to be installed globally and then initialized in your project directory.

### Prerequisites

Tested with Node 6.9.2

### Installing

```
npm install -g docudbploy
```

## Project setup

In yur project directory run:

```
docudbploy init
```

This will create dpcudbploy.json file that controls all configuration such as documentdb connection details.

```
{
  "globs": ["**/*.js"], //Global walk-sync minimatch.Minimatch glob of files and directories to include
  "ignore": ["docudbploy.json"], //ignore these globs
  "env": [
    {
      "id": "dev", //A unique
      "endpointUri": "<your endpoint URI>", //From your documentdb setup
      "primaryKey": "<endpoint primary key>", //From your documentdb setup
      "database": "<database name>", //Database to create and connect to
      "collections": [
        "<collection name>"
      ], //Array of collections to validate
      "deploy": true, //Whether this environment should be deployed
      "autoDeploy": false //Not yet used
      "globs": [], //Environment specific include glob
      "ignore": [] //ignore these globs
    },
  ]
}
```

## Creating server scripts

Use the create command to set server side scripts that contain all of your business logic.

```
docudbploy create <type> <filename>

e.g. docudbploy create sp my-first-sp.js
```

This will create a template file in the current directory, using the filename as a basis for the server scripts id and function name.
 - its OK to change these, just ensure they meet documentDb's rules. Now just write your script in the serverScript.

```
module.exports = {
  id: 'myFirstSp', //A unique ID for each object
  type: 'sp', //Either sp or udf
  collections:['activity', 'device'], //Array of collections in which object is to be written, empty for all
  serverScript: function myFirstSp() {
      var context = getContext();
      var response = context.getResponse();

      response.setBody("Your logic goes here in the body");
  },
};

```


## Deployment

Run the deploy command. Optionally you can include and env ID and only that environment will be deployed. Otherwise every environment
with deploy: true will be processed. Processing validates the database and each collection, creating them if they dont exist. Then it
Processes each file included in the walk and upserts the server side script.

```
docudbploy deploy [env]
```

## Built With

* [camelcase] (https://github.com/sindresorhus/camelcase) - Generating unique Ids from filenames
* [commander] (https://github.com/tj/commander.js) - Parsing your commands
* [documentdb-q-promises] (https://github.com/Azure/azure-documentdb-node-q) - Promising docuemntdb
* [elegant-status] (https://github.com/inikulin/elegant-status) - Your feedback loop
* [jsonfile] (https://github.com/jprichardson/node-jsonfile) - Lovely JSON writing
* [lodash] (https://lodash.com) - Because _!
* [q] (https://github.com/kriskowal/q) - Promises, promises!
* [walk-sync] (https://github.com/joliss/node-walk-sync) - Gathering all those server scripts for us

## Contributing

Contributions are welcome, send me a pull request or issue

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
