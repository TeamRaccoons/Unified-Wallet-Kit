// this make sure that bn.js is not included in the bundle
const fs = require('fs');
const pkgJson= require('bn.js/package.json');

pkgJson.sideEffects = false;

fs.writeFileSync(
    'node_modules/bn.js/package.json',
    JSON.stringify(pkgJson, null, 2)
);