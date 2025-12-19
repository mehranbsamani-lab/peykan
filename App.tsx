import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppData, Car, OilChangeRecord } from './types';
import {
  getAppData,
  getUserCars,
  createCarForUser,
  updateCarMileage as updateCarMileageRemote,
  updateCar as updateCarRemote,
  addRecord as addRecordRemote,
} from './services/storage';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AddCarModal } from './components/AddCarModal';

const openGoogleCalendarReminder = (carName: string | undefined, record: OilChangeRecord) => {
  try {
    const nextDate = new Date(record.nextChangeDate);
    if (Number.isNaN(nextDate.getTime())) return;

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`; // all-day event

    const title = encodeURIComponent(
      `یادآوری تعویض روغن ${carName ? `- ${carName}` : ''}`.trim()
    );
    const details = encodeURIComponent(
      `تعویض روغن در کیلومتر ${record.nextChangeMileage.toLocaleString()}`
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open Google Calendar', error);
  }
};

const App: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [currentCarId, setCurrentCarId] = useState<string | null>(null);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded) return;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userCars = await getUserCars(user.id);
        setCars(userCars);

        if (userCars.length === 0) {
          setData({ car: null, history: [] });
          setCurrentCarId(null);
        } else {
          // آخرین خودرو به‌عنوان فعال
          const lastCar = userCars[userCars.length - 1];
          setCurrentCarId(lastCar.id);
          const loadedData = await getAppData(user.id, lastCar.id);
          setData(loadedData);
        }
      } catch (error) {
        console.error('Error loading app data', error);
        setData({ car: null, history: [] });
      } finally {
        setLoading(false);
      }

      if ('Notification' in window && Notification.permission === 'default') {
        // Keep as-is; can be triggered later by user action
      }
    };

    load();
  }, [isLoaded, user]);

  const handleOnboardingComplete = async (car: Car) => {
    if (!user) return;
    try {
      setLoading(true);
      await createCarForUser(user.id, car);
      const userCars = await getUserCars(user.id);
      setCars(userCars);
      const lastCar = userCars[userCars.length - 1];
      setCurrentCarId(lastCar?.id ?? null);
      const newData = await getAppData(user.id, lastCar?.id);
      if (newData) {
        setData(newData);
      }
    } catch (error) {
      console.error('Error completing onboarding', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCarClick = () => {
    setAddCarModalOpen(true);
  };

  const handleAddCarFromModal = async (car: Car) => {
    if (!user) return;
    try {
      setLoading(true);
      if (editingCar) {
        // ویرایش خودروی موجود
        await updateCarRemote(user.id, car.id, {
          name: car.name,
          category: car.category,
          currentMileage: car.currentMileage,
        });
        const userCars = await getUserCars(user.id);
        setCars(userCars);
        // اگر خودروی ویرایش شده همان خودروی فعال است، داده‌ها را به‌روزرسانی کن
        if (car.id === currentCarId) {
          const updatedData = await getAppData(user.id, car.id);
          setData(updatedData);
        }
        setEditingCar(null);
      } else {
        // افزودن خودروی جدید
        await createCarForUser(user.id, car);
        const userCars = await getUserCars(user.id);
        setCars(userCars);
        const lastCar = userCars[userCars.length - 1];
        setCurrentCarId(lastCar?.id ?? null);
        const newData = await getAppData(user.id, lastCar?.id);
        if (newData) {
          setData(newData);
        }
      }
      setAddCarModalOpen(false);
    } catch (error) {
      console.error('Error saving car', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setAddCarModalOpen(true);
  };

  const handleAddRecord = async (record: OilChangeRecord) => {
    if (!user || !data?.car) return;
    try {
      setLoading(true);
      const newData = await addRecordRemote(user.id, data.car.id, record);
      setData({ ...newData });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تعویض روغن ثبت شد', {
          body: `تعویض بعدی در کیلومتر ${record.nextChangeMileage.toLocaleString()}`,
          dir: 'rtl',
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // Open Google Calendar with a pre-filled reminder for next change date
      openGoogleCalendarReminder(data.car.name, record);
    } catch (error) {
      console.error('Error adding record', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMileage = async (mileage: number) => {
    if (!user || !data?.car) return;
    try {
      setLoading(true);
      const newData = await updateCarMileageRemote(user.id, data.car.id, mileage);
      setData({ ...newData });
    } catch (error) {
      console.error('Error updating mileage', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCar = async (carId: string) => {
    if (!user) return;
    try {
      setLoading(true);
      setCurrentCarId(carId);
      const carData = await getAppData(user.id, carId);
      setData(carData);
    } catch (error) {
      console.error('Error switching car', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        در حال آماده‌سازی حساب کاربری...
      </div>
    );
  }

  if (!user) {
    // SignedOut در index.tsx ریدایرکت می‌کند؛ این فقط برای اطمینان است.
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        در حال بارگذاری...
      </div>
    );
  }

  if (!data?.car) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <Dashboard
        data={data}
        cars={cars}
        currentCarId={currentCarId}
        onAddRecord={handleAddRecord}
        onUpdateMileage={handleUpdateMileage}
        onSelectCar={handleSelectCar}
        onAddNewCar={handleAddNewCarClick}
        onEditCar={handleEditCar}
      />
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => {
          setAddCarModalOpen(false);
          setEditingCar(null);
        }}
        onSave={handleAddCarFromModal}
        editingCar={editingCar}
      />
    </div>
  );
};

export default App;
