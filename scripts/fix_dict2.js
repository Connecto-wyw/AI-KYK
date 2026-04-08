const fs = require('fs');
let s = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

// The file currently contains the literal characters backslash and 'n' outside of quotes, e.g. `",\n` literally.
// Let's replace any instance of comma followed by literal \n that is NOT inside quotes.
// Since JS files are simple, replacing `",\\n` with `",\n` is safe.
// Also replacing `.\\n` with `.\n` if it's outside. But wait, `shopItem3WhyFooter: "...",\n` has the literal `\n` after the comma or quote?
// Let's just fix the trailing `\n` literal after the injected blocks.
s = s.replace(/",\\n/g, '",\n');
s = s.replace(/",\\n\s*shopItem2Sub/g, '",\n    shopItem2Sub');
s = s.replace(/,\s*\\n/g, ',\n');
s = s.replace(/\\n\s*shopItem2Sub/g, '\n    shopItem2Sub');

fs.writeFileSync('src/lib/i18n/dictionaries.ts', s);
console.log('Fixed globally!');
