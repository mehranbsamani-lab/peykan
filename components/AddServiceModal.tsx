import React, { useState, useEffect } from 'react';
import { OilChangeRecord } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { X, Calendar, Gauge, Settings2 } from 'lucide-react';
import { DEFAULT_INTERVAL_KM, DEFAULT_INTERVAL_MONTHS, OIL_TYPE_OPTIONS, SERVICE_TYPE_OPTIONS } from '../constants';
import { ServiceType } from '../types';

interface AddServiceModalProps {
  currentMileage: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: OilChangeRecord) => Promise<void>;
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
  const [serviceType, setServiceType] = useState<ServiceType>('oil_change');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update mileage when currentMileage changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMileage(currentMileage.toString());
      setError(null);
    }
  }, [isOpen, currentMileage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const mileageNum = Number(mileage);
    const intervalKmNum = Number(intervalKm);
    const intervalMonthsNum = Number(intervalMonths);

    if (!mileageNum || mileageNum <= 0) {
      setError('لطفاً کیلومتر تعویض را به درستی وارد کنید');
      return;
    }

    if (!intervalKmNum || intervalKmNum <= 0) {
      setError('لطفاً فاصله کیلومتری را به درستی وارد کنید');
      return;
    }

    if (!intervalMonthsNum || intervalMonthsNum <= 0) {
      setError('لطفاً فاصله زمانی را به درستی وارد کنید');
      return;
    }

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
      oilType: serviceType === 'oil_change' ? oilType : undefined,
      serviceType,
    };

    try {
      setIsSubmitting(true);
      await onSave(newRecord);
      onClose();
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setMileage(currentMileage.toString());
      setIntervalKm(DEFAULT_INTERVAL_KM.toString());
      setIntervalMonths(DEFAULT_INTERVAL_MONTHS.toString());
      setServiceType('oil_change');
      setOilType(OIL_TYPE_OPTIONS[0]);
    } catch (err) {
      console.error('Error saving record', err);
      setError('خطا در ثبت سرویس. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
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
          {/* همه فیلدها در یک ستون */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              نوع سرویس
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value as ServiceType);
                // برای سرویس‌های غیر از روغن، oilType رو پاک کن
                if (e.target.value !== 'oil_change') {
                  setOilType(undefined);
                } else {
                  setOilType(OIL_TYPE_OPTIONS[0]);
                }
              }}
            >
              {SERVICE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

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

          <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Settings2 className="w-4 h-4" />
              <span className="text-sm font-semibold">تنظیمات دوره بعدی</span>
            </div>
            
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

            {/* نوع روغن - فقط برای تعویض روغن نمایش داده می‌شود */}
            {serviceType === 'oil_change' && (
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
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ثبت...' : 'ثبت'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
