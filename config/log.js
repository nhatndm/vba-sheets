const chalk = require('chalk');
const logSymbols = require('log-symbols');
const log = console.log;

exports.print = (text) => {
  log(`${logSymbols.success} ${chalk.cyan(text)}`);
};

exports.printErr = (err) => {
  log(`${logSymbols.error} ${chalk.red(err)}`);
};
