import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

const salarySnippet = `
              {tutorData?.expected_salary && (
                <div className="flex gap-3 items-start">
                  <DollarSign className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    {isOwnProfile || currentUser.role === 'admin' || (currentUser.role === 'guardian' && false) ? (
                      <>প্রত্যাশিত বেতন: <span className="font-semibold">৳ {tutorData.expected_salary}</span></>
                    ) : (
                      <>প্রত্যাশিত বেতন: <span className="text-gray-500 italic">🔒 লুকানো আছে</span></>
                    )}
                  </p>
                </div>
              )}
`;

content = content.replace(
  /\{tutorData\?\.demo_class_link && \(/,
  salarySnippet + '\n              {tutorData?.demo_class_link && ('
);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
console.log("Added salary to profile page");
