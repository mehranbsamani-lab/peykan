export interface Car {
  id: string;
  name: string;
  /** دسته‌بندی/نوع خودرو، مثلا سواری، شاسی‌بلند و ... */
  category?: string;
  currentMileage: number;
  lastUpdated: string; // ISO Date
}

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
}

export interface AppData {
  car: Car | null;
  history: OilChangeRecord[];
}
