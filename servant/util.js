/* eslint-disable no-undef */
const os = require('os');
const chalk = require('chalk');
const commander = require('commander');
const path = require('path');

// Defines an interceptable and more "nice looking" logger based on elementary console calls
const logger = {
    info: (...args) => console.info(chalk.white.bgGreen.bold(' INFO: '), ...args),
    error: (...args) => console.error(chalk.white.bgRed.bold('\n ERRORS: \n'), ...args, '\n'),
    warn: (...args) => console.warn(chalk.white.bgYellow.bold('\n WARNING: \n'), ...args, '\n'),
    log: (...args) => console.log(...args),
    debug: (...args) => console.debug(chalk.white.bgBlue.bold(' DEBUG: '), ...args, '\n'),
    clear: () => console.clear()
};

const validateCommandLineArguments = args => {
    if (!args.scratchPath) {
        logger.error('No path to a Scratch file was given, please use the -s option');
        process.exit(1);
    }

    if (!args.testPath && !args.isGeneticSearch) {
        logger.error('No path to a test file was given, please use the -t option');
        process.exit(1);
    }

    if (args.numberOfTabs > os.cpus().length) {
        logger.error(`You selcted to parallelize the tests in ${args.numberOfTabs} tabs, while only having ` +
            `${os.cpus().length} threads / CPUs available. Please do not use more than ${os.cpus().length}, as ` +
            `otherwise tests might fail and will need longer to initialize.`);
        process.exit(1);
    }
};

// Defines the CLI interface of the runner, including checks and defaults.
const cli = {
    start: () => {
        commander
            .option('-u, --whiskerURL <URL>', 'File URL of the Whisker instance to run the tests', '../whisker-web/dist/index.html')
            .option('-s, --scratchPath <Path>', 'Scratch application to run, or directory containing results', false)
            .option('-t, --testPath <Path>', 'Tests to run', false)
            .option('-a, --accelerationFactor <Integer>', 'Acceleration factor', 1)
            .option('-v, --csvFile <Path>', 'Name of CSV File to put output into', false)
            .option('-c, --configPath <Path>', 'Path to a configuration file', '../whisker-main/config/default.json')
            .option('-d, --isHeadless', 'If should run headless (d like in decapitated)')
            .option('-p, --numberOfTabs <Integer>', 'The number of tabs to execute the tests in', 1)
            .option('-k, --isConsoleForwarded', 'If the browser\'s console output should be forwarded', false)
            .option('-o, --isLiveOutputCoverage', 'If new output of the coverage should be printed regularly', false)
            .option('-l, --isLiveLogEnabled', 'If the new output of the log should be printed regularly', false)
            .option('-g, --isGeneticSearch', 'If new tests should be generated via genetic search', false);

        commander.parse(process.argv);

        const {
            whiskerURL,
            scratchPath,
            testPath,
            accelerationFactor,
            csvFile,
            configPath,
            isHeadless,
            numberOfTabs,
            isConsoleForwarded,
            isLiveOutputCoverage,
            isLiveLogEnabled,
            isGeneticSearch
        } = commander;

        validateCommandLineArguments(commander);

        return {
            whiskerURL: `file://${path.resolve(whiskerURL)}`,
            testPath,
            scratchPath,
            configPath,
            csvFile,
            accelerationFactor,
            isHeadless,
            numberOfTabs,
            isConsoleForwarded,
            isLiveOutputCoverage,
            isLiveLogEnabled,
            isGeneticSearch
        };
    }
};

module.exports = {logger, cli};
