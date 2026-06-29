import fs from 'fs';
let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/const handleInitiateOtpVerify = \([\s\S]*?navigateTo\("verify-otp"\);\n\s*\};\n/, '');
fs.writeFileSync('src/App.tsx', appStr);
