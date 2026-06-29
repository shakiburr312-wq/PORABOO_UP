import fs from 'fs';

let profileStr = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

profileStr = profileStr.replace(
  /Camera, MapPin, GraduationCap, Briefcase, BookOpen, Layers, Globe, DollarSign, Edit2, Link as LinkIcon, Edit, ConnectPattern, Users/,
  'Camera, MapPin, GraduationCap, Briefcase, BookOpen, Layers, Globe, DollarSign, Edit2, Link as LinkIcon, Edit, Users'
);

fs.writeFileSync('src/pages/ProfilePage.tsx', profileStr);
console.log('Fixed ProfilePage imports');
