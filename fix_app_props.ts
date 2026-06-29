import fs from 'fs';

let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/onInitiateOtpVerify=\{handleInitiateOtpVerify\}/, '');
fs.writeFileSync('src/App.tsx', appStr);
