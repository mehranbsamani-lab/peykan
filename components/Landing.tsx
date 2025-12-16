import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { Droplets } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <header className="max-w-5xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-400/40 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight">تعویض‌روغن‌یار</span>
        </div>
        <SignInButton mode="modal">
          <button className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 transition">
            ورود / ثبت‌نام
          </button>
        </SignInButton>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-6 py-10 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              دیگر
              <span className="text-blue-400"> زمان تعویض روغن </span>
              خودروی‌تان را فراموش نکنید.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              تعویض‌روغن‌یار، کیلومتر، تاریخ، نوع روغن و سرویس‌های شما را دنبال می‌کند
              تا همیشه در بهترین زمان ممکن، موتور خودروی‌تان را تازه نگه دارید.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-blue-500 text-sm font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-95 transition">
                  شروع استفاده در کمتر از ۳۰ ثانیه
                </button>
              </SignInButton>
              <div className="text-[11px] sm:text-xs text-slate-400">
                بدون نصب،
                <span className="mx-1 text-slate-200">کاملاً رایگان</span>
                و مخصوص رانندگان ایرانی.
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                یادآوری هوشمند بر اساس کیلومتر و تاریخ
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                ذخیره امن روی Supabase + ورود با Clerk
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-10 bg-blue-500/10 blur-3xl" />
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl shadow-blue-950/60 overflow-hidden">
                <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-slate-50">پژو ۲۰۶</div>
                      <div className="text-[10px] text-slate-400">۱۲۳٬۴۵۰ km</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/10 rounded-full px-2 py-0.5">
                    ۱٬۲۰۰ کیلومتر تا سرویس بعدی
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32 mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-slate-800 stroke-current"
                          strokeWidth="8"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>
                        <circle
                          className="stroke-blue-400"
                          strokeWidth="8"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * 68) / 100}
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-50">۱٬۲۰۰</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">کیلومتر مانده</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span>تاریخ تعویض بعدی:</span>
                      <span className="font-semibold text-slate-50">۲۵ اسفند ۱۴۰۳</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


