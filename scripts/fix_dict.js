const fs = require('fs');
let s = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');
s = s.replace(/,\\n    shopItem2Sub:/g, ',\n    shopItem2Sub:');
fs.writeFileSync('src/lib/i18n/dictionaries.ts', s);
console.log('Fixed literal slash-n escapes!');
