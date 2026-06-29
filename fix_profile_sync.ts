import fs from 'fs';

// App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');

appStr = appStr.replace(
  /<ProfilePage\n\s*currentUser=\{currentUser\}\n\s*profileId=\{currentRoute\.split\("\/"\)\[1\] \|\| currentUser\.id\}\n\s*onLogout=\{handleLogout\}\n\s*\/>/,
  `<ProfilePage
                currentUser={currentUser}
                profileId={currentRoute.split("/")[1] || currentUser.id}
                onLogout={handleLogout}
                onUserUpdate={setCurrentUser}
              />`
);

fs.writeFileSync('src/App.tsx', appStr);

// ProfilePage.tsx
let profileStr = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

profileStr = profileStr.replace(
  /interface ProfilePageProps \{[\s\S]*?onLogout: \(\) => void;\n\}/,
  `interface ProfilePageProps {
  currentUser: Profile;
  profileId: string;
  onLogout: () => void;
  onUserUpdate: (user: Profile) => void;
}`
);

profileStr = profileStr.replace(
  /export default function ProfilePage\(\{ currentUser, profileId, onLogout \}: ProfilePageProps\) \{/,
  'export default function ProfilePage({ currentUser, profileId, onLogout, onUserUpdate }: ProfilePageProps) {'
);

profileStr = profileStr.replace(
  /setProfileData\(\{ \.\.\.profileData, avatar_url: urlData\.publicUrl \}\);/,
  `setProfileData({ ...profileData, avatar_url: urlData.publicUrl });
          if (isOwnProfile) {
            onUserUpdate({ ...currentUser, avatar_url: urlData.publicUrl } as Profile);
            // Also update local storage
            const local = localStorage.getItem("poraboo_current_user");
            if (local) {
              const parsed = JSON.parse(local);
              parsed.avatar_url = urlData.publicUrl;
              localStorage.setItem("poraboo_current_user", JSON.stringify(parsed));
            }
          }`
);

fs.writeFileSync('src/pages/ProfilePage.tsx', profileStr);
console.log('App and ProfilePage updated for avatar sync');
