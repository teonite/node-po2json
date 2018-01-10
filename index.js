const program = require('commander');
const path = require('path');
const fs = require('fs');
const po2json = require('po2json');

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

    const source_obj = fs.readFileSync(path.resolve(source));
    const parsed_source = po2json.parse(source_obj);
    for (const key in parsed_source) {
        if (parsed_source.hasOwnProperty(key)) {
            parsed_source[key] = parsed_source[key][1];
        }
    }
    fs.writeFileSync(path.resolve(target), JSON.stringify(parsed_source, null, 2));
}

program
    .version('1.0.0')
    .usage('[oprions] <source> <target>')
    .arguments('<source> <target>')
    .option('-r, --recursive', 'Recursively convert all files in directory')
    .parse(process.argv);

const NO_COMMAND_SPECIFIED = program.args.length === 0;

if(NO_COMMAND_SPECIFIED) {
   program.help();
}

const source = program.args[0], target = program.args[1];

if(!program.recursive) {
    convert_file(source, target);
} else {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    fs.readdir(source, (err, filenames) => {
        if(!filenames) {
            console.error('No files in source directory!');
            process.exit(1);
        }
        const files = filenames.filter(file => path.extname(file) === '.po');

        if(files.length === 0) {
            console.error('No .json files to convert in target directory!');
            process.exit(1);
        }

        files.forEach(file => {
            const target_file = path.basename(file, path.extname(file)) + '.json';
            convert_file(path.join(source, file), path.join(target, target_file));
        })
    })
}
