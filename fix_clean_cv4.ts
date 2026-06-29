import fs from 'fs';

let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

// Replace toast with console.error
code = code.replace(/toast\(.*?\);/g, 'console.error("Error saving");');

// Add loading state back
code = code.replace(/const \[loadingMsg, setLoadingMsg\] = useState\(""\);/, 'const [loadingMsg, setLoadingMsg] = useState("");\n  const [loading, setLoading] = useState(false);');

// Import CheckCircle2
code = code.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
    if (!p1.includes('CheckCircle2')) {
        return `import { ${p1}, CheckCircle2 } from "lucide-react";`;
    }
    return match;
});

// For loading in handleSave
code = code.replace(/const handleSave = async \(e: React.FormEvent\) => \{/g, 'const handleSave = async (e: React.FormEvent) => {\n    setLoading(true);');
code = code.replace(/onComplete\(\);\n  \};\n/g, 'onComplete();\n    setLoading(false);\n  };\n');
// Also need to set loading to false in catch blocks
code = code.replace(/console.error\("Error saving"\);/g, 'console.error("Error saving");\n      setLoading(false);');

fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('done');
