import React, { useState, useMemo } from 'react';
import { AppData, Car, OilChangeRecord } from '../types';
import { Button } from './Button';
import { AddServiceModal } from './AddServiceModal';
import { UpdateMileageModal } from './UpdateMileageModal';
import { Droplets, Gauge, History, AlertTriangle, Calendar, Plus, Edit3, LogOut, Pencil, Menu, X } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { toPersianDateFull } from '../utils/dateUtils';
import { SERVICE_TYPE_OPTIONS } from '../constants';

interface DashboardProps {
  data: AppData;
  cars: Car[];
  currentCarId: string | null;
  onAddRecord: (record: OilChangeRecord) => void;
  onUpdateMileage: (mileage: number) => void;
  onSelectCar: (carId: string) => void;
  onAddNewCar: () => void;
  onEditCar?: (car: Car) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  cars,
  currentCarId,
  onAddRecord,
  onUpdateMileage,
  onSelectCar,
  onAddNewCar,
  onEditCar,
}) => {
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isMileageModalOpen, setMileageModalOpen] = useState(false);
  const [isCarMenuOpen, setCarMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const lastRecord = data.history.length > 0 ? data.history[0] : null;
  const lastOilChangeRecord = data.history.find(
    (r) => !r.serviceType || r.serviceType === 'oil_change'
  );

  // Calculations - فقط برای تعویض روغن
  const status = useMemo(() => {
    // پیدا کردن آخرین سرویس تعویض روغن
    const lastOilChange = data.history.find(
      (r) => !r.serviceType || r.serviceType === 'oil_change'
    );

    if (!lastOilChange || !data.car) return { type: 'unknown', text: 'هنوز سرویسی ثبت نشده' };

    const kmDriven = data.car.currentMileage - lastOilChange.mileageAtChange;
    const kmRemaining = lastOilChange.intervalKm - kmDriven;
    const percentUsed = Math.min(100, Math.max(0, (kmDriven / lastOilChange.intervalKm) * 100));
    
    // Date Calc
    const daysRemaining = Math.ceil((new Date(lastOilChange.nextChangeDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    let statusType: 'good' | 'warning' | 'danger' = 'good';
    if (kmRemaining <= 0 || daysRemaining <= 0) statusType = 'danger';
    else if (kmRemaining < 1000 || daysRemaining < 14) statusType = 'warning';

    return {
      type: statusType,
      kmRemaining,
      kmDriven,
      percentUsed,
      daysRemaining,
      nextDate: toPersianDateFull(lastOilChange.nextChangeDate),
      nextKm: lastOilChange.nextChangeMileage
    };
  }, [data.car, data.history]);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'good': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'danger': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'good': return 'stroke-emerald-500';
      case 'warning': return 'stroke-amber-500';
      case 'danger': return 'stroke-red-500';
      default: return 'stroke-slate-300';
    }
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-slate-100 flex justify-between items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setCarMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-slate-400">خودروی فعال</span>
              <span className="text-sm font-bold text-slate-800">
                {data.car?.name}
              </span>
              {data.car?.category && (
                <span className="mt-0.5 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                  {data.car.category}
                </span>
              )}
            </div>
            <Edit3 className="w-4 h-4 text-slate-400" />
          </button>

          {isCarMenuOpen && cars.length > 1 && (
            <div className="absolute mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
              {cars.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    setCarMenuOpen(false);
                    onSelectCar(car.id);
                  }}
                  className={`w-full px-3 py-2.5 text-right text-sm flex flex-col gap-0.5 hover:bg-slate-50 ${
                    car.id === currentCarId ? 'bg-slate-50' : ''
                  }`}
                >
                  <span className="font-semibold text-slate-800">{car.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {car.currentMileage.toLocaleString()} km
                    {car.category ? ` • ${car.category}` : ''}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div
            className="flex items-center gap-1 text-slate-500 text-sm mt-2 cursor-pointer"
            onClick={() => setMileageModalOpen(true)}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{data.car?.currentMileage.toLocaleString()} km</span>
            <Edit3 className="w-3 h-3 text-slate-300 ml-1" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition active:scale-95"
          >
            {isHamburgerMenuOpen ? (
              <X className="w-5 h-5 text-slate-700" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700" />
            )}
          </button>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        
        {/* Main Status Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          {status.type === 'unknown' ? (
             <div className="text-center py-8">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-slate-600 mb-4">هنوز هیچ سرویس تعویض روغنی ثبت نکرده‌اید.</p>
               <Button onClick={() => setServiceModalOpen(true)}>اولین ثبت</Button>
             </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className={`${getProgressColor(status.type)} progress-ring-circle transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (status.percentUsed || 0) / 100)}
                  ></circle>
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${status.type === 'danger' ? 'text-red-600' : 'text-slate-800'}`}>
                    {status.kmRemaining?.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm mt-1">کیلومتر مانده</span>
                </div>
              </div>

              {/* Detail Chips */}
              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${getStatusColor(status.type)}`}>
                  <span className="text-xs opacity-80 mb-1">تاریخ تعویض بعدی</span>
                  <span className="font-bold">{status.nextDate}</span>
                </div>
                <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center text-slate-700">
                  <span className="text-xs text-slate-400 mb-1">کیلومتر تعویض بعدی</span>
                  <span className="font-bold">{status.nextKm?.toLocaleString()}</span>
                </div>
              </div>

              {/* Warning Message if needed */}
              {status.type !== 'good' && (
                <div className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span>زمان تعویض روغن فرا رسیده است!</span>
                </div>
              )}

              <Button fullWidth onClick={() => setServiceModalOpen(true)}>
                ثبت تعویض روغن جدید
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMileageModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <div className="bg-indigo-50 p-2 rounded-full">
              <Gauge className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">آپدیت کیلومتر</span>
          </button>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1">
            <div className="bg-orange-50 p-2 rounded-full">
              <Droplets className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">نوع روغن</span>
            <span className="text-xs text-slate-500">
              {lastOilChangeRecord?.oilType ?? 'ثبت نشده'}
            </span>
          </div>
        </div>

        {/* Active Cars List */}
        {cars.length > 1 && (
          <div className="mt-6">
            <h3 className="text-slate-900 font-bold mb-3 flex items-center gap-2 px-1">
              <History className="w-4 h-4 text-slate-400" />
              لیست خودروهای شما
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className={`w-full px-4 py-3 flex items-center justify-between ${
                    car.id === currentCarId ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCar(car.id)}
                    className="flex-1 flex items-center justify-between text-right hover:bg-slate-50 transition rounded-lg px-2 py-1 -mx-2 -my-1"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-slate-800">{car.name}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {car.currentMileage.toLocaleString()} km
                        {car.category ? ` • ${car.category}` : ''}
                      </span>
                    </div>
                    {car.id === currentCarId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        فعال
                      </span>
                    )}
                  </button>
                  {onEditCar && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCar(car);
                      }}
                      className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                      title="ویرایش خودرو"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Preview */}
        {data.history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-slate-900 font-bold mb-3 flex items-center gap-2 px-1">
              <History className="w-4 h-4 text-slate-400" />
              تاریخچه
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
              {data.history.slice(0, 3).map((record) => {
                const serviceLabel = SERVICE_TYPE_OPTIONS.find(
                  (opt) => opt.value === (record.serviceType || 'oil_change')
                )?.label || 'تعویض روغن';
                return (
                  <div key={record.id} className="p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {toPersianDateFull(record.date)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {serviceLabel}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1">
                        در کیلومتر {record.mileageAtChange.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                      {record.intervalKm.toLocaleString()} km
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Hamburger Menu Overlay */}
      {isHamburgerMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsHamburgerMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">منو</h3>
                <button
                  type="button"
                  onClick={() => setIsHamburgerMenuOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-4">
                  {/* افزودن خودروی جدید */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHamburgerMenuOpen(false);
                      onAddNewCar();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition text-right"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">افزودن خودروی جدید</div>
                      <div className="text-xs text-slate-500 mt-0.5">ثبت خودروی جدید</div>
                    </div>
                  </button>

                  {/* آپدیت کیلومتر */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHamburgerMenuOpen(false);
                      setMileageModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition text-right"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">بروزرسانی کیلومتر</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {data.car?.currentMileage.toLocaleString()} km
                      </div>
                    </div>
                  </button>

                  {/* تاریخچه کامل */}
                  {data.history.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsHamburgerMenuOpen(false);
                        // می‌تونی بعداً یک صفحه تاریخچه کامل اضافه کنی
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition text-right"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                        <History className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">تاریخچه کامل</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {data.history.length} سرویس ثبت شده
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Divider */}
                  <div className="my-2 border-t border-slate-200" />

                  {/* خروج */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHamburgerMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-right"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-red-600">خروج از حساب</div>
                      <div className="text-xs text-red-400 mt-0.5">خروج از حساب کاربری</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200">
                <div className="text-xs text-slate-400 text-center">
                  تعویض روغن یار
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Action Button (Alternative to button in card) */}
      <button 
        onClick={() => setServiceModalOpen(true)}
        className="fixed bottom-6 left-6 bg-slate-900 text-white w-14 h-14 rounded-full shadow-lg shadow-slate-400/50 flex items-center justify-center active:scale-90 transition-transform z-20"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modals */}
      <AddServiceModal 
        isOpen={isServiceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        currentMileage={data.car?.currentMileage || 0}
        onSave={onAddRecord}
      />
      <UpdateMileageModal
        isOpen={isMileageModalOpen}
        onClose={() => setMileageModalOpen(false)}
        currentMileage={data.car?.currentMileage || 0}
        onSave={onUpdateMileage}
      />
    </div>
  );
};
