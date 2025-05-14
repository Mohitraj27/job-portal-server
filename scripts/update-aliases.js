const fs = require('fs');
const path = require('path');
require('dotenv').config();
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

// Update aliases to point to dist directory, except in development environment
if (process.env.NODE_ENV !== 'development') {
    const aliases = packageJson._moduleAliases;
    for (const key in aliases) {
        aliases[key] = aliases[key].replace('src/', 'dist/');
    }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
