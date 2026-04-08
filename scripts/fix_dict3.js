const fs = require('fs');
let s = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

// The file currently contains `\n,\n  },`.
// Simply find lines that only contain `,` and remove them.
s = s.replace(/\n,\n/g, '\n');

fs.writeFileSync('src/lib/i18n/dictionaries.ts', s);
console.log('Fixed trailing comma lines!');
