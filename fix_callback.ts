import fs from 'fs';

let appStr = fs.readFileSync('src/App.tsx', 'utf8');

if (!appStr.includes('import AuthCallback')) {
  appStr = appStr.replace(
    /import Login from "\.\/pages\/Login";/,
    'import Login from "./pages/Login";\nimport AuthCallback from "./pages/AuthCallback";'
  );
}

appStr = appStr.replace(
  /else if \(hash === "#\/dashboard"/,
  'else if (hash.startsWith("#/auth/callback")) { setCurrentRoute("auth/callback"); } else if (hash === "#/dashboard"'
);

if (!appStr.includes('currentRoute === "auth/callback"')) {
  appStr = appStr.replace(
    /\{currentRoute === "login" && \(/,
    `{currentRoute === "auth/callback" && <AuthCallback />}
      {currentRoute === "login" && (`
  );
}

fs.writeFileSync('src/App.tsx', appStr);
