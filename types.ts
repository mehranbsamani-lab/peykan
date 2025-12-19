export interface Car {
  id: string;
  name: string;
  /** دسته‌بندی/نوع خودرو، مثلا سواری، شاسی‌بلند و ... */
  category?: string;
  currentMileage: number;
  lastUpdated: string; // ISO Date
}

export type ServiceType = 'oil_change' | 'air_filter' | 'coolant' | 'brake_fluid';

export interface OilChangeRecord {
  id: string;
  date: string; // ISO Date
  mileageAtChange: number;
  intervalKm: number; // e.g., 5000
  intervalMonths: number; // e.g., 6
  nextChangeMileage: number;
  nextChangeDate: string; // ISO Date
  note?: string;
  /** نوع روغن استفاده‌شده، مثلا بهران، لوکومولی و ... */
  oilType?: string;
  /** نوع سرویس: تعویض روغن، فیلتر هوا، ضد یخ، روغن ترمز */
  serviceType?: ServiceType;
}

export interface AppData {
  car: Car | null;
  history: OilChangeRecord[];
}
