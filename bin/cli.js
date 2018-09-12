#!/usr/bin/env node
const iosguidetopdf = require("../index.js")

function run(argv) {
    if (argv[0] === '-v' || argv[0] === '--version') {
        console.log('  0.0.1');
	} else if (argv[0] === '-h' || argv[0] === '--help') {
        console.log('  usage:\n');
        console.log('  -url [iOS Programming Guide Page URL]')
		console.log('  -v --version [show version]');
	} else if (argv[0] === '-url') {
        iosguidetopdf(argv[1])
    }
}
run(process.argv.slice(2))