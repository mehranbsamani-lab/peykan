import moment from 'moment-jalaali';

/**
 * تبدیل تاریخ میلادی به شمسی
 * @param date - تاریخ میلادی (ISO string یا Date object)
 * @param format - فرمت خروجی (پیش‌فرض: 'jYYYY/jMM/jDD')
 * @returns تاریخ شمسی به صورت رشته
 */
export const toPersianDate = (date: string | Date, format: string = 'jYYYY/jMM/jDD'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) {
      return '';
    }
    return moment(dateObj).format(format);
  } catch (error) {
    console.error('Error converting to Persian date', error);
    return '';
  }
};

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت کامل
 * مثال: ۱۴۰۳/۰۱/۱۵
 */
export const toPersianDateFull = (date: string | Date): string => {
  return toPersianDate(date, 'jYYYY/jMM/jDD');
};

/**
 * تبدیل تاریخ میلادی به شمسی با نام ماه
 * مثال: ۱۵ فروردین ۱۴۰۳
 */
export const toPersianDateWithMonth = (date: string | Date): string => {
  return toPersianDate(date, 'jD jMMMM jYYYY');
};

