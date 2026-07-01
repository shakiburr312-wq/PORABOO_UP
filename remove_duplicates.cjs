const fs = require('fs');
let code = fs.readFileSync('src/lib/translations.ts', 'utf8');

// A very naive approach could break the file, so let's do this carefully:
// We will evaluate the object using the AST, or just manually clean up.
// Actually, it's easier to just let TS ignore it with @ts-nocheck ? No, that's bad practice.
// Let's find the lines with errors by running `npx tsc --noEmit` and parse the line numbers, then remove those lines.

const { execSync } = require('child_process');

try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
} catch (e) {
  const output = e.stdout.toString();
  const linesToRemove = [];
  const regex = /src\/lib\/translations\.ts\((\d+),\d+\): error TS1117:/g;
  let match;
  while ((match = regex.exec(output)) !== null) {
    linesToRemove.push(parseInt(match[1], 10));
  }
  
  if (linesToRemove.length > 0) {
    const lines = code.split('\n');
    const newLines = lines.filter((_, idx) => !linesToRemove.includes(idx + 1));
    fs.writeFileSync('src/lib/translations.ts', newLines.join('\n'));
    console.log('Removed ' + linesToRemove.length + ' duplicate lines.');
  } else {
    console.log('No duplicates found.');
  }
}
