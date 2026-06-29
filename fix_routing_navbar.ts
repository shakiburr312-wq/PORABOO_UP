import fs from 'fs';

// App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');

appStr = appStr.replace(
  /hash === "#\/dashboard" \|\| hash === "#\/feed" \|\| hash === "#\/tutor\/onboarding" \|\| hash === "#\/guardian\/dashboard" \|\| hash === "#\/guardian\/post\/new"/,
  'hash === "#/dashboard" || hash === "#/feed" || hash === "#/tutor/onboarding" || hash === "#/guardian/dashboard" || hash === "#/guardian/post/new" || hash.startsWith("#/profile")'
);

appStr = appStr.replace(
  /else if \(hash === "#\/tutor\/onboarding"\) setCurrentRoute\("tutor\/onboarding"\);/,
  'else if (hash === "#/tutor/onboarding") setCurrentRoute("tutor/onboarding");\n          else if (hash.startsWith("#/profile")) setCurrentRoute(hash.replace("#/", ""));'
);

appStr = appStr.replace(
  /\(currentRoute === "dashboard" \|\| currentRoute === "feed" \|\| currentRoute === "tutor\/onboarding" \|\| currentRoute === "guardian\/dashboard" \|\| currentRoute === "guardian\/post\/new"\)/,
  '(currentRoute === "dashboard" || currentRoute === "feed" || currentRoute === "tutor/onboarding" || currentRoute === "guardian/dashboard" || currentRoute === "guardian/post/new" || currentRoute.startsWith("profile"))'
);

appStr = appStr.replace(
  /import GuardianDashboard from "\.\/pages\/GuardianDashboard";\nimport GuardianPostJob from "\.\/pages\/GuardianPostJob";/,
  'import GuardianDashboard from "./pages/GuardianDashboard";\nimport GuardianPostJob from "./pages/GuardianPostJob";\nimport ProfilePage from "./pages/ProfilePage";'
);

appStr = appStr.replace(
  /\} : currentRoute === "guardian\/post\/new" \? \(/,
  `} : currentRoute.startsWith("profile") ? (
              <ProfilePage
                currentUser={currentUser}
                profileId={currentRoute.split("/")[1] || currentUser.id}
                onLogout={handleLogout}
              />
            ) : currentRoute === "guardian/post/new" ? (`
);

fs.writeFileSync('src/App.tsx', appStr);

// Navbar.tsx
let navStr = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

navStr = navStr.replace(
  /<div \n\s*onClick=\{\(\) => navigateTo\(currentUser\.role === 'tutor' \? 'tutor\/onboarding' : 'guardian\/dashboard'\)\}\n\s*className="flex items-center gap-2 px-3 py-1\.5 rounded-full bg-navy\/5 text-navy border border-navy\/10 hover:bg-navy\/10 transition-all cursor-pointer"\n\s*>/,
  `<div 
                  onClick={() => navigateTo('profile')}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                >`
);

navStr = navStr.replace(
  /<User className="w-4 h-4 text-navy" \/>\n\s*<span className="text-xs font-semibold">\{currentUser\.full_name\}<\/span>\n\s*<span className="text-\[9px\] bg-teal text-white px-1\.5 py-0\.2 rounded-full uppercase">\n\s*\{currentUser\.role === "tutor" \? t\("nav_tutor"\) : t\("nav_guardian"\)\}\n\s*<\/span>/,
  `<img 
                    src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-yellow"
                    alt={currentUser.full_name}
                  />
                  <span className="text-sm font-semibold text-navy">{currentUser.full_name}</span>`
);

navStr = navStr.replace(
  /<div className="mr-3 flex items-center gap-1\.5 px-2\.5 py-1 rounded-full bg-navy\/5 text-navy text-xs border border-navy\/10">/,
  `<div className="mr-3 flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => navigateTo('profile')}>`
);
navStr = navStr.replace(
  /<span className="max-w-\[70px\] truncate font-medium">\{currentUser\.full_name\}<\/span>/,
  `<img 
                  src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} 
                  className="w-7 h-7 rounded-full object-cover border border-yellow"
                  alt={currentUser.full_name}
                />
                <span className="max-w-[70px] truncate font-medium">{currentUser.full_name}</span>`
);

fs.writeFileSync('src/components/Navbar.tsx', navStr);
console.log('App and Navbar fixed');
