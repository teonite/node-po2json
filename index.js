#! /usr/bin/env node
var program = require('commander');
var path = require('path');
var fs = require('fs');
var po2json = require('po2json');

function convert_file(source, target) {
    if(path.extname(source) !== '.po') {
        console.error('Source file is not in po format! ('+ source +')');
        process.exit(1);
    }
    if(path.extname(target) !== '.json') {
        console.error('Target file is not in json format! ('+ target +')');
        process.exit(1);
    }
    console.log('Converting! ', source, target);

    var source_obj = fs.readFileSync(path.resolve(source));
    var parsed_source = po2json.parse(source_obj);
    for (var key in parsed_source) {
        if (parsed_source.hasOwnProperty(key)) {
            parsed_source[key] = parsed_source[key][1];
        }
    }
    fs.writeFileSync(path.resolve(target), JSON.stringify(parsed_source, null, 2));
}

program
    .version('1.0.0')
    .usage('[options] <source> <target>')
    .arguments('<source> <target>')
    .option('-r, --recursive', 'Recursively convert all files in directory')
    .parse(process.argv);

var NO_COMMAND_SPECIFIED = program.args.length === 0;

if(NO_COMMAND_SPECIFIED) {
   program.help();
}

var source = program.args[0], target = program.args[1];

if(!program.recursive) {
    convert_file(source, target);
} else {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    fs.readdir(source, function(err, filenames) {
        if(!filenames) {
            console.error('No files in source directory!');
            process.exit(1);
        }
        const files = filenames.filter(function(file) {
            return path.extname(file) === '.po';
        });

        if(files.length === 0) {
            console.error('No .json files to convert in target directory!');
            process.exit(1);
        }

        files.forEach(function(file) {
            var target_file = path.basename(file, path.extname(file)) + '.json';
            convert_file(path.join(source, file), path.join(target, target_file));
        })
    })
}
