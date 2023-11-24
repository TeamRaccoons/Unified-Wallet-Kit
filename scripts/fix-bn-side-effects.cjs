// this make sure that bn.js is not included in the bundle
const fs = require('fs');

for (pkg of ['bn.js']) {
  const pkgJson = require(`${pkg}/package.json`);
  pkgJson.sideEffects = false;

  fs.writeFileSync(`node_modules/${pkg}/package.json`, JSON.stringify(pkgJson, null, 2));
}
