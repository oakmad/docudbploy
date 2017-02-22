#! /usr/bin/env node
const program = require('commander');
const initialize = require('./lib/init');
const create = require('./lib/create');
const utils = require('./lib/utils');
const deploy = require('./lib/deploy');
const watch = require('./lib/watch');


console.log('\r\nAzDocDb - Azure DocumentDb helper\r\n');
program
  .version('0.1.0');
program
  .command('init')
  .description('initialize current directory create azdocdb.json')
  .action(() => {
    initialize();
  });
program
  .command('create <type> <filename>')
  .description('deploy server scripts, optionally to the specified environment')
  .action((type, name) => {
    if (typeof type === 'undefined' || typeof type === 'undefined') {
      console.error('Both type and name are required!');
      process.exit(1);
    }
    if (!utils.validType(type)) {
      console.error('Invalid type, must be sp, trig or udf');
      process.exit(1);
    }
    create(type, name);
  });
program
  .command('deploy [env]')
  .description('deploy to the specified environment')
  .action((env) => {
    deploy(env);
  });

program
  .command('watch')
  .description('watch and automatically deploy changed files')
  .action(() => {
    // watch();
    console.log('Coming soon');
  });

program.parse(process.argv);

if (!program.args.length) { program.help(); }
