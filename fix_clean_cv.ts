import fs from 'fs';

let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

// Remove fillMode, loading, uploadProgress, errorMsg, successMsg, autoFilledFields related to CV
code = code.replace(/const \[fillMode, setFillMode\] = useState<"choose" \| "ai" \| "manual">"choose"\);\n/, '');
code = code.replace(/const \[fillMode, setFillMode\] = useState<any>\("choose"\);\n/, '');
code = code.replace(/const \[fillMode, setFillMode\].*?;\n/, '');
code = code.replace(/const \[loading, setLoading\].*?;\n/, '');
code = code.replace(/const \[uploadProgress, setUploadProgress\].*?;\n/, '');
code = code.replace(/const \[errorMsg, setErrorMsg\].*?;\n/, '');
code = code.replace(/const \[successMsg, setSuccessMsg\].*?;\n/, '');
code = code.replace(/const \[autoFilledFields, setAutoFilledFields\].*?;\n/, '');
code = code.replace(/const fileInputRef = useRef<HTMLInputElement>\(null\);\n/, '');

// Remove handleFileUpload
code = code.replace(/const handleFileUpload = async[\s\S]*?};(\r?\n)+/, '');

// Remove the AI parsing view and choose view blocks
code = code.replace(/if \(loading && fillMode === "ai"\) \{[\s\S]*?return \([\s\S]*?\}\n/, '');

// Remove the `fillMode === "choose"` return block entirely. Actually, it's easier to remove it via AST or manual chunk removal.

fs.writeFileSync('src/pages/TutorOnboarding.tsx.bak', code);
console.log('Done');
