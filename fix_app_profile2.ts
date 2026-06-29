import fs from 'fs';

let appStr = fs.readFileSync('src/App.tsx', 'utf8');

if (!appStr.includes('<ProfilePage')) {
  appStr = appStr.replace(
    /\) : currentRoute === "guardian\/post\/new" \? \(/,
    `) : currentRoute.startsWith("profile") ? (
              <ProfilePage
                currentUser={currentUser}
                profileId={currentRoute.split("/")[1] || currentUser.id}
                onLogout={handleLogout}
                onUserUpdate={setCurrentUser}
              />
            ) : currentRoute === "guardian/post/new" ? (`
  );
}

fs.writeFileSync('src/App.tsx', appStr);
console.log('App.tsx profile page rendering injected');
