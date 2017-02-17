#! /usr/bin/env node
const program = require('commander');
const initialize = require('./lib/init');
const create = require('./lib/create');
const utils = require('./lib/utils');
const deploy = require('./lib/deploy');

console.log('\r\nDocuDbPloy\r\n');
program
  .version('0.1.0');
program
  .command('init')
  // .description('initialize with a new docudbploy.json')
  .action(() => {
    initialize();
  });
program
  .command('create <type> <filename>')
  // .description('deploy to the specified environment')
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

program.parse(process.argv);

if (!program.args.length) { program.help(); }
