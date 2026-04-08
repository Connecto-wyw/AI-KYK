const fs = require('fs');
let s = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

// The file literally contains `."\n,` outside the string due to double-patching artifacts.
// We globally replace `"\\n,` with `",\n`
s = s.replace(/"\\n,/g, '",\n');
s = s.replace(/"\\n\n/g, '",\n');

fs.writeFileSync('src/lib/i18n/dictionaries.ts', s);
console.log('Fixed syntax strings correctly!');
