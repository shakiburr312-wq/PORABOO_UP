import fs from 'fs';

let profileStr = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
profileStr = profileStr.replace(/<BounceDots color="#fff" \/>/g, '<BounceDots />');
fs.writeFileSync('src/pages/ProfilePage.tsx', profileStr);
console.log('Fixed BounceDots props');
