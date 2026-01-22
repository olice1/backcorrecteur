/**
 * Google Apps Script للتكامل مع Google Sheets
 * 
 * تعليمات الإعداد:
 * 1. افتح Google Sheets جديد
 * 2. أضف الأعمدة التالية في الصف الأول:
 *    - التاريخ | الاسم | الهاتف | المدينة | العنوان | المقاس | الكمية | ملاحظات | رقم الطلب
 * 
 * 3. اذهب إلى: Extensions > Apps Script
 * 4. احذف أي كود موجود وألصق هذا الكود
 * 5. احفظ المشروع (اسمه: JOWDEX Form Handler)
 * 6. اضغط Deploy > New deployment
 * 7. اختر نوع: Web app
 * 8. في "Execute as": اختر نفسك
 * 9. في "Who has access": اختر "Anyone"
 * 10. اضغط Deploy
 * 11. انسخ الـ Web app URL
 * 12. ألصق الـ URL في ملف config.js (سيتم إنشاؤه)
 */

function doPost(e) {
  try {
    // الحصول على الورقة النشطة
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // تحليل البيانات المرسلة
    var data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد بالبيانات - COD Format
    sheet.appendRow([
      new Date(),                    // التاريخ والوقت
      data.orderRef || '',           // رقم الطلب
      data.name || '',               // الاسم الكامل
      data.phone || '',              // رقم الهاتف الأول
      data.phone2 || '',             // رقم الهاتف الثاني
      data.email || '',              // البريد الإلكتروني
      data.country || '',            // الدولة
      data.city || '',               // المدينة
      data.address || '',            // العنوان الكامل
      data.size || '',               // المقاس
      data.quantity || '',           // الكمية
      data.notes || ''               // ملاحظات
    ]);
    
    // إرجاع استجابة ناجحة
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'تم حفظ البيانات بنجاح'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // في حالة حدوث خطأ
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'حدث خطأ: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة اختبارية لتجربة الكود
 * يمكنك تشغيلها من Apps Script Editor للتأكد من عمل الكود
 */
function testFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // إضافة صف تجريبي
  sheet.appendRow([
    new Date(),
    'اسم تجريبي',
    '12345678',
    'المنامة',
    'عنوان تجريبي',
    'L',
    '1',
    'هذا اختبار',
    'JDX12345678'
  ]);
  
  Logger.log('تم إضافة صف تجريبي بنجاح');
}

/**
 * دالة لإعداد الورقة تلقائياً
 * قم بتشغيلها مرة واحدة لإضافة العناوين
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // إضافة العناوين - COD Format
  sheet.appendRow([
    'التاريخ',
    'رقم الطلب',
    'الاسم الكامل',
    'رقم الهاتف الأول',
    'رقم الهاتف الثاني',
    'البريد الإلكتروني',
    'الدولة',
    'المدينة',
    'العنوان الكامل',
    'المقاس',
    'الكمية',
    'ملاحظات'
  ]);
  
  // تنسيق صف العناوين
  var headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a2b4a');
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  
  // ضبط عرض الأعمدة
  sheet.setColumnWidth(1, 150);   // التاريخ
  sheet.setColumnWidth(2, 120);   // رقم الطلب
  sheet.setColumnWidth(3, 150);   // الاسم
  sheet.setColumnWidth(4, 130);   // الهاتف الأول
  sheet.setColumnWidth(5, 130);   // الهاتف الثاني
  sheet.setColumnWidth(6, 180);   // الإيميل
  sheet.setColumnWidth(7, 100);   // الدولة
  sheet.setColumnWidth(8, 120);   // المدينة
  sheet.setColumnWidth(9, 250);   // العنوان
  sheet.setColumnWidth(10, 80);   // المقاس
  sheet.setColumnWidth(11, 80);   // الكمية
  sheet.setColumnWidth(12, 200);  // ملاحظات
  
  Logger.log('تم إعداد الورقة بنجاح');
}
