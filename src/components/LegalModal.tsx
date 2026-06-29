import { X, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

interface LegalModalProps {
  type: "privacy" | "terms" | "refund" | null;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const content = {
    privacy: {
      title: "গোপনীয়তা নীতি — Privacy Policy",
      subtitle: "PORABOO প্ল্যাটফর্মে আপনার তথ্যের সুরক্ষা আমাদের প্রধান অগ্রাধিকার।",
      paragraphs: [
        "১. আমরা আপনার নাম, ফোন নম্বর, ইমেইল এড্রেস এবং এনআইডি (NID) নম্বর সুরক্ষিত ডাটাবেজে এনক্রিপ্ট করে রাখি।",
        "২. কোনো অবস্থাতেই কোনো টিউটর বা অভিভাবকের ব্যক্তিগত যোগাযোগের তথ্য এডমিনের সম্মতি ও সরাসরি এসাইনমেন্ট নিশ্চিত হওয়ার পূর্বে শেয়ার করা হয় না।",
        "৩. আপনার কোনো ব্যক্তিগত তথ্য বাণিজ্যিক উদ্দেশ্যে তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হবে না। এটি আইনত দণ্ডনীয় অপরাধ।"
      ]
    },
    terms: {
      title: "ব্যবহারের শর্তাবলী — Terms of Service",
      subtitle: "আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলী মেনে নিতে সম্মত হচ্ছেন:",
      paragraphs: [
        "১. টিউটরদের অবশ্যই তাদের সার্টিফিকেটের সত্যতা নিশ্চিত করতে হবে। যেকোনো মিথ্যা বা ভুল তথ্য প্রদানের কারণে অ্যাকাউন্ট স্থায়ীভাবে বাতিল করা হবে।",
        "২. কোনো সরাসরি যোগাযোগ বা ব্যাকডোর যোগাযোগের চেষ্টা করা হলে প্ল্যাটফর্ম চার্জের দ্বিগুণ জরিমানা এবং আইনি ব্যবস্থা গ্রহণ করা হতে পারে।",
        "৩. অভিভাবকেরা টিউটর রিকোয়েস্ট সম্পূর্ণ বিনামূল্যে পোস্ট করতে পারবেন। তবে কনফার্মেশনের পর আমাদের সার্ভিস চার্জ নীতি প্রযোজ্য হবে।"
      ]
    },
    refund: {
      title: "রিফান্ড নীতি — Refund Policy",
      subtitle: "আমরা সর্বদা স্বচ্ছ এবং পরিচ্ছন্ন রিফান্ড পলিসি মেনে চলি:",
      paragraphs: [
        "১. যদি কোনো টিউশন নিয়োগ নিশ্চিত হওয়ার প্রথম সপ্তাহের মধ্যে বাতিল হয়ে যায়, তবে নেওয়া প্ল্যাটফর্ম কমিশন বা চার্জের সম্পূর্ণ অংশ (১০০%) রিফান্ড করা হবে।",
        "২. বাতিল হওয়ার প্রমাণাদি আমাদের হেল্প সেন্টারে জমা দেওয়ার ৪৮ ঘণ্টার মধ্যে রিফান্ড সরাসরি আপনার ওয়ালেট বা বিকাশ অ্যাকাউন্টে পাঠিয়ে দেওয়া হবে।",
        "৩. কোনো টিউটর অবহেলা বা নিয়ম ভঙ্গ করার কারণে টিউশন হারালে রিফান্ড নীতি প্রযোজ্য নাও হতে পারে।"
      ]
    }
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Modal Card */}
      <div className="bg-white rounded-3xl border border-navy/10 w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-fadeInUp max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-navy/10 flex justify-between items-center bg-navy-bg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-navy text-base sm:text-lg">{content.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:bg-navy/5 hover:text-navy transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-left text-sm text-text-muted leading-relaxed">
          <p className="font-bold text-navy">{content.subtitle}</p>
          <div className="space-y-3.5 pt-2">
            {content.paragraphs.map((p, idx) => (
              <div key={idx} className="p-4 bg-navy-bg rounded-xl border border-navy/5 flex items-start gap-3">
                <div className="p-1 rounded-full bg-teal text-white mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-navy/10 flex justify-end bg-navy-bg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow text-navy font-bold rounded-xl text-xs sm:text-sm hover:shadow-md transition-all cursor-pointer"
          >
            ঠিক আছে, আমি বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
}
