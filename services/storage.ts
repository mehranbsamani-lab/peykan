import { supabase } from '../supabaseClient';
import { AppData, Car, OilChangeRecord } from '../types';

// همه خودروهای کاربر
export const getUserCars = async (userId: string): Promise<Car[]> => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading user cars', error);
      return [];
    }

    return (
      (data as any[] | null)?.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category ?? undefined,
        currentMileage: Number(row.current_mileage),
        lastUpdated: row.last_updated,
      })) ?? []
    );
  } catch (error) {
    console.error('Unexpected error loading user cars', error);
    return [];
  }
};

// وضعیت یک خودرو (تک‌ماشین) + تاریخچه‌اش
export const getAppData = async (userId: string, carId?: string | null): Promise<AppData> => {
  try {
    let carRow: any | undefined;

    if (carId) {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId)
        .eq('id', carId)
        .single();

      if (error) {
        console.error('Error loading selected car', error);
        return { car: null, history: [] };
      }
      carRow = data;
    } else {
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId)
        // آخرین خودروی ایجادشده را به‌عنوان خودروی فعال در نظر می‌گیریم
        .order('created_at', { ascending: false })
        .limit(1);

      if (carsError) {
        console.error('Error loading cars', carsError);
        return { car: null, history: [] };
      }

      carRow = (cars as any[] | null)?.[0];
      if (!carRow) {
        return { car: null, history: [] };
      }
    }

    const car: Car = {
      id: carRow.id,
      name: carRow.name,
      category: carRow.category ?? undefined,
      currentMileage: Number(carRow.current_mileage),
      lastUpdated: carRow.last_updated,
    };

    const { data: records, error: recordsError } = await supabase
      .from('oil_change_records')
      .select('*')
      .eq('car_id', car.id)
      .order('date', { ascending: false });

    if (recordsError) {
      console.error('Error loading oil change records', recordsError);
      return { car, history: [] };
    }

    const history: OilChangeRecord[] =
      (records as any[] | null)?.map((r) => ({
        id: r.id,
        date: r.date,
        mileageAtChange: Number(r.mileage_at_change),
        intervalKm: Number(r.interval_km),
        intervalMonths: Number(r.interval_months),
        nextChangeMileage: Number(r.next_change_mileage),
        nextChangeDate: r.next_change_date,
        oilType: r.oil_type ?? undefined,
        note: r.note ?? undefined,
      })) ?? [];

    return { car, history };
  } catch (error) {
    console.error('Unexpected error loading app data', error);
    return { car: null, history: [] };
  }
};

// Create a new car for a user at onboarding time
export const createCarForUser = async (userId: string, car: Car): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cars')
      .insert({
        id: car.id,
        user_id: userId,
        name: car.name,
        category: car.category ?? null,
        current_mileage: car.currentMileage,
        last_updated: car.lastUpdated,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating car', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error creating car', error);
    throw error;
  }
};

// Update car mileage
export const updateCarMileage = async (
  userId: string,
  carId: string,
  newMileage: number
): Promise<AppData> => {
  try {
    const { error } = await supabase
      .from('cars')
      .update({
        current_mileage: newMileage,
        last_updated: new Date().toISOString(),
      })
      .eq('id', carId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating mileage', error);
      throw error;
    }

    return await getAppData(userId, carId);
  } catch (error) {
    console.error('Unexpected error updating mileage', error);
    throw error;
  }
};

// Update car details (name, category, mileage)
export const updateCar = async (
  userId: string,
  carId: string,
  updates: { name?: string; category?: string; currentMileage?: number }
): Promise<void> => {
  try {
    const updateData: any = {
      last_updated: new Date().toISOString(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.category !== undefined) updateData.category = updates.category ?? null;
    if (updates.currentMileage !== undefined) updateData.current_mileage = updates.currentMileage;

    const { error } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', carId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating car', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error updating car', error);
    throw error;
  }
};

// Add an oil change record and update car mileage accordingly
export const addRecord = async (
  userId: string,
  carId: string,
  record: OilChangeRecord
): Promise<AppData> => {
  try {
    const { error: insertError } = await supabase.from('oil_change_records').insert({
      id: record.id,
      car_id: carId,
      date: record.date,
      mileage_at_change: record.mileageAtChange,
      interval_km: record.intervalKm,
      interval_months: record.intervalMonths,
      next_change_mileage: record.nextChangeMileage,
      next_change_date: record.nextChangeDate,
      oil_type: record.oilType ?? null,
      note: record.note ?? null,
    });

    if (insertError) {
      console.error('Error inserting oil change record', insertError);
      throw insertError;
    }

    const { error: updateError } = await supabase
      .from('cars')
      .update({
        current_mileage: record.mileageAtChange,
        last_updated: new Date().toISOString(),
      })
      .eq('id', carId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating car after record insert', updateError);
    }

    return await getAppData(userId, carId);
  } catch (error) {
    console.error('Unexpected error adding record', error);
    throw error;
  }
};

