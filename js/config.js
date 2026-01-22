/**
 * ملف التكوين - Configuration File
 * 
 * استبدل القيم التالية بالقيم الخاصة بك:
 */

const CONFIG = {
    // Facebook Pixel ID
    // احصل عليه من: Facebook Events Manager > Pixels
    FACEBOOK_PIXEL_ID: 'tajer Pixel ID',
    
    // Google Analytics 4 Measurement ID
    // احصل عليه من: GA4 > Admin > Data Streams
    // يبدأ بـ G-XXXXXXXXXX
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    
    // Google Apps Script Web App URL
    // بعد نشر Google Apps Script كـ Web App، انسخ الرابط هنا
    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbxuWg73BIrJJ7qQKk4GkPoEhytn60S9q2VJAQGi2UO377ORK8HjyWo-Y3rVucDx0XGl/exec',
    
    // قيمة التحويل التقديرية (بالدينار البحريني)
    LEAD_VALUE: 25.00,
    
    // العملة
    CURRENCY: 'BHD'
};

// تصدير التكوين للاستخدام في main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
