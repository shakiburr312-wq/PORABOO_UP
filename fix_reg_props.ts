import fs from 'fs';

let regStr = fs.readFileSync('src/pages/Register.tsx', 'utf8');

regStr = regStr.replace(/onInitiateOtpVerify: \(payload: any\) => void;/, '');
regStr = regStr.replace(/export default function Register\(\{ onBackToHome, navigateTo \}: RegisterProps\) \{/, 'export default function Register({ onBackToHome, navigateTo }: RegisterProps) {');

fs.writeFileSync('src/pages/Register.tsx', regStr);
