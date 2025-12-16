import React, { useState, useMemo } from 'react';
import { Car } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Car as CarIcon, Gauge } from 'lucide-react';
import { CAR_CATEGORY_OPTIONS } from '../constants';

interface OnboardingProps {
  onComplete: (car: Car) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [mileage, setMileage] = useState('');
  const [error, setError] = useState('');
   const [categoryQuery, setCategoryQuery] = useState('');
   const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

   const filteredCategories = useMemo(
     () =>
       CAR_CATEGORY_OPTIONS.filter((c) =>
         c.toLowerCase().includes(categoryQuery.toLowerCase())
       ),
     [categoryQuery]
   );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mileage || isNaN(Number(mileage))) {
      setError('لطفاً کیلومتر فعلی خودرو را به درستی وارد کنید');
      return;
    }

    const newCar: Car = {
      id: crypto.randomUUID(),
      name: name || 'خودروی من',
      category: selectedCategory,
      currentMileage: Number(mileage),
      lastUpdated: new Date().toISOString(),
    };

    onComplete(newCar);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <CarIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">خوش آمدید</h1>
          <p className="text-slate-500">برای شروع، مشخصات خودروی خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Input
            label="نام خودرو (اختیاری)"
            placeholder="مثلاً: پژو ۲۰۶"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* دسته‌بندی خودرو - کمبوباکس ساده با قابلیت سرچ */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              دسته‌بندی خودرو (اختیاری)
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="مثلاً: سواری، شاسی‌بلند..."
                value={categoryQuery}
                onChange={(e) => {
                  setCategoryQuery(e.target.value);
                  setSelectedCategory(undefined);
                }}
              />
              {categoryQuery && (
                <div className="absolute z-20 mt-1 w-full max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg text-sm">
                  {filteredCategories.length === 0 ? (
                    <div className="px-3 py-2 text-slate-400">
                      موردی پیدا نشد
                    </div>
                  ) : (
                    filteredCategories.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="w-full text-right px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => {
                          setSelectedCategory(option);
                          setCategoryQuery(option);
                        }}
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Input
            label="کیلومتر فعلی"
            type="number"
            inputMode="numeric"
            placeholder="مثلاً: ۱۲۰۰۰۰"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            error={error}
            icon={<Gauge className="w-5 h-5" />}
          />

          <Button type="submit" fullWidth className="mt-4">
            ثبت و شروع
          </Button>
        </form>
      </div>
    </div>
  );
};
