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

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
