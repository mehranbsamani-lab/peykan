import React, { useMemo, useState } from 'react';
import { Car } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Car as CarIcon, Gauge, X } from 'lucide-react';
import { CAR_CATEGORY_OPTIONS } from '../constants';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
  editingCar?: Car | null;
}

export const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, onSave, editingCar }) => {
  const [name, setName] = useState('');
  const [mileage, setMileage] = useState('');
  const [error, setError] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // وقتی editingCar تغییر می‌کنه، فرم رو پر می‌کنیم
  React.useEffect(() => {
    if (editingCar) {
      setName(editingCar.name);
      setMileage(editingCar.currentMileage.toString());
      setSelectedCategory(editingCar.category);
      setCategoryQuery(editingCar.category || '');
    } else {
      setName('');
      setMileage('');
      setError('');
      setCategoryQuery('');
      setSelectedCategory(undefined);
    }
  }, [editingCar, isOpen]);

  const filteredCategories = useMemo(
    () =>
      CAR_CATEGORY_OPTIONS.filter((c) =>
        c.toLowerCase().includes(categoryQuery.toLowerCase())
      ),
    [categoryQuery]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mileage || isNaN(Number(mileage))) {
      setError('لطفاً کیلومتر فعلی خودرو را به درستی وارد کنید');
      return;
    }

    const carData: Car = {
      id: editingCar?.id || crypto.randomUUID(),
      name: name || (editingCar ? editingCar.name : 'خودروی جدید من'),
      category: selectedCategory,
      currentMileage: Number(mileage),
      lastUpdated: new Date().toISOString(),
    };

    onSave(carData);
    if (!editingCar) {
      setName('');
      setMileage('');
      setError('');
      setCategoryQuery('');
      setSelectedCategory(undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center">
              <CarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-slate-900">
                {editingCar ? 'ویرایش خودرو' : 'افزودن خودروی جدید'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {editingCar ? 'اطلاعات خودرو را ویرایش کنید.' : 'برای این خودرو یک نام و کیلومتر فعلی ثبت کنید.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="نام خودرو (اختیاری)"
            placeholder="مثلاً: پژو ۲۰۶ نقره‌ای"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
                <div className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg text-sm">
                  {filteredCategories.length === 0 ? (
                    <div className="px-3 py-2 text-slate-400">موردی پیدا نشد</div>
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
            placeholder="مثلاً: ۸۵۰۰۰"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            error={error}
            icon={<Gauge className="w-4 h-4" />}
          />

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" className="flex-1">
              {editingCar ? 'ذخیره تغییرات' : 'ثبت خودرو'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


