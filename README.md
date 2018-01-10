# node-po2json

Simple tool for converting `.po` files to `.json` files

```
Usage: node-po2json [options] <source> <target>


  Options:

    -V, --version    output the version number
    -r, --recursive  Recursively convert all files in directory
    -h, --help       output usage information
```

### Installation
```
npm install --save node-po2json
```

### Usage
```
node-po2json source.po target.json
```
```
node-po2json -r sourceDir targetDir
```

or in `package.json`
```
{
    // ...
    "scripts": {
        //...
        "convert:po": "node-po2json -r sourceDir targetDir"
    },
    // ...
}
```

### License

MIT