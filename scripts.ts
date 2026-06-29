import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Remove VerifyOtp and DemoBanner
appCode = appCode.replace(/import VerifyOtp from "\.\/pages\/VerifyOtp";\n/, '');
appCode = appCode.replace(/const \[showDemoBanner, setShowDemoBanner\] = useState\(true\);\n/, '');
appCode = appCode.replace(/\{\/\* Dynamic Demo Mode Ribbon Banner[\s\S]*?\{!isSupabaseConfigured && showDemoBanner && \([\s\S]*?<\/div>\n\s*\)\}/, '');
appCode = appCode.replace(/\{currentRoute === "verify-otp" && \([\s\S]*?onVerifySuccess=\{handleVerifySuccess\}\n\s*\/>\n\s*\)\}/, '');
appCode = appCode.replace(/else if \(hash === "#\/verify-otp"\) \{\n\s*setCurrentRoute\("verify-otp"\);\n\s*\}/, '');

// Add Settings route
appCode = appCode.replace(/else if \(hash === "#\/dashboard"/, 'else if (hash === "#/settings") { const u = getLocalCurrentUser(); if (u) { setCurrentUser(u); setCurrentRoute("settings"); } else { setCurrentRoute("login"); } } else if (hash === "#/dashboard"');
appCode = appCode.replace(/\|\| currentRoute\.startsWith\("profile"\)/, '|| currentRoute.startsWith("profile") || currentRoute === "settings"');

if (!appCode.includes('import SettingsPage')) {
  appCode = appCode.replace(/import ProfilePage from "\.\/pages\/ProfilePage";\n/, 'import ProfilePage from "./pages/ProfilePage";\nimport SettingsPage from "./pages/SettingsPage";\n');
}

// Add Settings component mapping
appCode = appCode.replace(/\) : currentRoute === "guardian\/post\/new" \? \(/, `) : currentRoute === "settings" ? (
              <SettingsPage 
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            ) : currentRoute === "guardian/post/new" ? (`);

fs.writeFileSync('src/App.tsx', appCode);
