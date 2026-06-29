import fs from 'fs';

let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

// 1. Remove states
code = code.replace(/const \[fillMode, setFillMode\] = useState<"choose" \| "ai" \| "manual">.*?;\n/g, '');
code = code.replace(/const \[loading, setLoading\] = useState.*?;\n/g, '');
code = code.replace(/const \[uploadProgress, setUploadProgress\] = useState.*?;\n/g, '');
code = code.replace(/const \[errorMsg, setErrorMsg\] = useState.*?;\n/g, '');
code = code.replace(/const \[successMsg, setSuccessMsg\] = useState.*?;\n/g, '');
code = code.replace(/const \[autoFilledFields, setAutoFilledFields\] = useState.*?;\n/g, '');
code = code.replace(/const fileInputRef = useRef.*?;\n/g, '');
code = code.replace(/import \{.*?UploadCloud.*?\} from "lucide-react";\n/g, (match) => {
    return match.replace(/UploadCloud,\s*/, '').replace(/CheckCircle2,\s*/, '');
});


// 2. Remove handleFileUpload function
const handleFileUploadStart = code.indexOf('const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {');
if (handleFileUploadStart !== -1) {
    let bracketCount = 1;
    let endIdx = handleFileUploadStart + 'const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {'.length;
    while(bracketCount > 0 && endIdx < code.length) {
        if(code[endIdx] === '{') bracketCount++;
        else if (code[endIdx] === '}') bracketCount--;
        endIdx++;
    }
    // consume the trailing semicolon and newline if present
    if (code[endIdx] === ';') endIdx++;
    if (code[endIdx] === '\n') endIdx++;
    code = code.substring(0, handleFileUploadStart) + code.substring(endIdx);
}

// 3. Remove "if (loading && fillMode === 'ai')" block
code = code.replace(/if \(loading && fillMode === "ai"\) \{[\s\S]*?return \([\s\S]*?\}\n/, '');

// 4. Remove {fillMode === "choose" && ( ... )}
const chooseStr = '{fillMode === "choose" && (';
const chooseStart = code.indexOf(chooseStr);
if (chooseStart !== -1) {
    let bracketCount = 1;
    let endIdx = chooseStart + chooseStr.length;
    while(bracketCount > 0 && endIdx < code.length) {
        if(code[endIdx] === '(') bracketCount++;
        else if (code[endIdx] === ')') bracketCount--;
        endIdx++;
    }
    if (code[endIdx] === '}') endIdx++; // the trailing } of &&
    code = code.substring(0, chooseStart) + code.substring(endIdx);
}

// 5. Remove {fillMode === "manual" && ( around the form and progress
code = code.replace(/\{fillMode === "manual" && \(\s*/g, '');
// For the progress bar, it has its own `)` and `}` at the end of the block.
// Let's replace the progress bar `)}`
code = code.replace(/\{fillMode === "manual" && \([\s\S]*?<div className="mt-8 glass-card p-4">([\s\S]*?)<\/div>\s*\)\}/g, '<div className="mt-8 glass-card p-4">$1</div>');

// The main form wrapper `{fillMode === "manual" && (`
code = code.replace(/\{fillMode === "manual" && \(\s*<form/g, '<form');
// Remove the closing `)}` of the form wrapper
code = code.replace(/<\/form>\s*\)\}/g, '</form>');

// Add the message "আপনার প্রোফাইল তথ্য পূরণ করুন" to the form top.
code = code.replace(/<p className="text-text-muted bangla-font">\{t\("tutor_onboarding_desc"\)\}<\/p>/, `<p className="text-text-muted bangla-font">আপনার প্রোফাইল তথ্য পূরণ করুন</p>`);

// Fix references to loading state inside handleSave
code = code.replace(/if \(loading\) return;/g, '');
code = code.replace(/setLoading\(true\);/g, '');
code = code.replace(/setLoading\(false\);/g, '');
code = code.replace(/disabled=\{loading\}/g, '');
code = code.replace(/\{loading \? .*? : "Submit"\}/g, 'Submit');
code = code.replace(/\{loading \? .*? : t\("save_continue"\)\}/g, '{t("save_continue")}');
code = code.replace(/\{loading \? t\("saving"\) \+ "\.\.\." : t\("save_continue"\)\}/g, '{t("save_continue")}');

// Remove errorMsg, successMsg render blocks
code = code.replace(/\{errorMsg && \([\s\S]*?<\/div>\s*\)\}/g, '');
code = code.replace(/\{successMsg && \([\s\S]*?<\/div>\s*\)\}/g, '');

// Clean up CVUploadLoader import if exists
code = code.replace(/import CVUploadLoader from ".*?";\n/g, '');

// Fix fields that depended on autoFilledFields
code = code.replace(/className=\{`w-full p-3 border-2 rounded-xl outline-none transition-all \$\{autoFilledFields\.[a-zA-Z_]+ \? 'bg-yellow\/10 border-yellow text-navy' : 'bg-white focus:border-yellow border-slate-200'\}[\s\S]*?`\}/g, 
    'className="w-full p-3 border-2 rounded-xl outline-none focus:border-yellow bg-white border-slate-200"');

// Fix education field specifically
code = code.replace(/className=\{`w-full p-3 border-2 rounded-xl outline-none appearance-none transition-all \$\{autoFilledFields\.education_qualification \? 'bg-yellow\/10 border-yellow text-navy' : 'border-slate-200 focus:border-yellow bg-white'\}[\s\S]*?`\}/g,
    'className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-yellow bg-white appearance-none"');

// Try removing all autoFilledFields usages via regex:
// Replace `${autoFilledFields.* ? ... : ...}` with whatever the default is.
code = code.replace(/\$\{autoFilledFields\.[a-zA-Z_]+ \? '[^']*' : '([^']*)'\}/g, '$1');

// Then any remaining `` that don't need backticks anymore, we can leave them or they are fine.

fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('done');
