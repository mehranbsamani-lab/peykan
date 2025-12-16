import React, { useState } from 'react';
import { OilChangeRecord } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { X, Calendar, Gauge, Settings2 } from 'lucide-react';
import { DEFAULT_INTERVAL_KM, DEFAULT_INTERVAL_MONTHS, OIL_TYPE_OPTIONS } from '../constants';

interface AddServiceModalProps {
  currentMileage: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: OilChangeRecord) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ 
  currentMileage, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(currentMileage.toString());
  const [intervalKm, setIntervalKm] = useState(DEFAULT_INTERVAL_KM.toString());
  const [intervalMonths, setIntervalMonths] = useState(DEFAULT_INTERVAL_MONTHS.toString());
  const [oilType, setOilType] = useState<string | undefined>(OIL_TYPE_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mileageNum = Number(mileage);
    const intervalKmNum = Number(intervalKm);
    const intervalMonthsNum = Number(intervalMonths);

    // Calculate next due date
    const changeDate = new Date(date);
    const nextDate = new Date(changeDate);
    nextDate.setMonth(nextDate.getMonth() + intervalMonthsNum);

    const newRecord: OilChangeRecord = {
      id: crypto.randomUUID(),
      date: new Date(date).toISOString(),
      mileageAtChange: mileageNum,
      intervalKm: intervalKmNum,
      intervalMonths: intervalMonthsNum,
      nextChangeMileage: mileageNum + intervalKmNum,
      nextChangeDate: nextDate.toISOString(),
      oilType,
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">ثبت تعویض روغن جدید</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاریخ"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
            />
            <Input
              label="کیلومتر تعویض"
              type="number"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              icon={<Gauge className="w-4 h-4" />}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Settings2 className="w-4 h-4" />
              <span className="text-sm font-semibold">تنظیمات دوره بعدی</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="فاصله کیلومتری"
                type="number"
                inputMode="numeric"
                value={intervalKm}
                onChange={(e) => setIntervalKm(e.target.value)}
                placeholder="5000"
              />
              <Input
                label="فاصله زمانی (ماه)"
                type="number"
                inputMode="numeric"
                value={intervalMonths}
                onChange={(e) => setIntervalMonths(e.target.value)}
                placeholder="6"
              />
            </div>

            {/* نوع روغن */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">
                نوع روغن
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={oilType ?? ''}
                onChange={(e) => setOilType(e.target.value || undefined)}
              >
                {OIL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              انصراف
            </Button>
            <Button type="submit" className="flex-1">
              ثبت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
