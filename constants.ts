export const STORAGE_KEY = 'roghan_yar_data_v1';

export const DEFAULT_INTERVAL_KM = 5000;
export const DEFAULT_INTERVAL_MONTHS = 6;

// ثابت: انواع خودرو برای نمایش در کمبوباکس
export const CAR_CATEGORY_OPTIONS: string[] = [
  'سواری',
  'هاچ‌بک',
  'شاسی‌بلند (SUV)',
  'وانت',
  'ون',
  'کامیونت / کامیون',
  'موتورسیکلت',
  'سایر',
];

// ثابت: انواع روغن پیش‌فرض
export const OIL_TYPE_OPTIONS: string[] = ['بهران', 'لوکومولی'];

// ثابت: انواع سرویس
export const SERVICE_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'oil_change', label: 'تعویض روغن' },
  { value: 'air_filter', label: 'فیلتر هوا' },
  { value: 'coolant', label: 'ضد یخ' },
  { value: 'brake_fluid', label: 'روغن ترمز' },
];

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
