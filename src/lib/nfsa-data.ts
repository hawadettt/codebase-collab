
export type NfsaSupplierSample = {
  supplierName: string;
  address: string;
  activityType: string;
  phoneNumber: string;
  notes: string;
};

// Sample data mimicking the structure requested by the user.
// This data is used for demonstration purposes on the NFSA Whitelist page.
export const nfsaSampleData: NfsaSupplierSample[] = [
  {
    "supplierName": "اجرو مصر لتصنيع وتعبئة الحاصلات الزراعية",
    "address": "النوبارية, البحيرة",
    "activityType": "تعبئة وتغليف وتجميد الخضار والفاكهة",
    "phoneNumber": "01001234567",
    "notes": "متخصص في التصدير لأوروبا"
  },
  {
    "supplierName": "اجريفروست",
    "address": "وادى النطرون, البحيرة",
    "activityType": "فرز وتعبئة وتجميد الخضروات والفاكهة",
    "phoneNumber": "01229876543",
    "notes": "حاصل على شهادة BRCGS"
  },
  {
    "supplierName": "اجرين للتنمية الزراعية",
    "address": "الكيلو 58, طريق القاهرة-الإسكندرية الصحراوي, البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "phoneNumber": "01112345678",
    "notes": "من أكبر مصدري العنب"
  },
  {
    "supplierName": "الأفق الجديدة للتنمية الزراعية والتصنيع الزراعى",
    "address": "التل الكبير, الإسماعيلية",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "phoneNumber": "01558765432",
    "notes": "يعمل بنظام التتبع الكامل"
  },
  {
    "supplierName": "البركة تريد",
    "address": "طنطا, الغربية",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "phoneNumber": "0401234567",
    "notes": "خبرة 20 عامًا في تصدير الموالح"
  },
    {
    "supplierName": "الجوهري للتجارة الدولية",
    "address": "بدر, البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "phoneNumber": "01011122233",
    "notes": "متخصص في الرمان والبرتقال"
  },
  {
    "supplierName": "سوناك",
    "address": "برج العرب, الإسكندرية",
    "activityType": "تعبئة وتجميد الخضر والفاكهة",
    "phoneNumber": "0344455566",
    "notes": "متخصص في الخضروات المجمدة"
  }
];
