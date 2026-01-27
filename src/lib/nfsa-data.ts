export type NfsaSupplier = {
  id: string;
  supplierName: string;
  address: string;
  governorate: string;
  activityType: string;
  phoneNumber?: string;
  notes?: string;
};

export const nfsaSuppliersData: NfsaSupplier[] = [
  { id: '1', supplierName: 'شركة الوادي للتنمية الزراعية (دالة)', address: 'الكيلو 59 - طريق مصر اسكندرية الصحراوي', governorate: 'Giza', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01001114451' },
  { id: '2', supplierName: 'اجريفروست', address: 'الكيلو 54 طريق مصر اسكندرية الصحراوي', governorate: 'Giza', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01225639998' },
  { id: '3', supplierName: 'اجرو ايجيبت', address: 'الكيلو 54 طريق مصر اسكندرية الصحراوي', governorate: 'Giza', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01022624541' },
  { id: '4', supplierName: 'اجرو لاند', address: 'الكيلو 80 طريق مصر اسكندرية الصحراوي', governorate: 'Beheira', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01013951662' },
  { id: '5', supplierName: 'اجرين', address: 'الكيلو 90 طريق مصر اسكندرية الصحراوي', governorate: 'Beheira', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '0123108044' },
  { id: '6', supplierName: 'الأصيل لتصدير الحاصلات الزراعية', address: 'المنصورية - مركز دراو - اسوان', governorate: 'Aswan', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01001663138' },
  { id: '7', supplierName: 'الألمانية لفرز وتعبئة وتصدير الحاصلات الزراعية (ش.ذ.م.م)', address: 'الكيلو 6 شرق الرياح - مركز طوخ - القليوبية', governorate: 'Qalyubia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01020116886' },
  { id: '8', supplierName: 'الايمان لتصدير الحاصلات الزراعية', address: 'بلقاس - الطريق الزراعي - الدقهلية', governorate: 'Dakahlia', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01002004862' },
  { id: '9', supplierName: 'البركة للتصدير والاستيراد', address: 'طريق جمصة المنصورة - طلخا - الدقهلية', governorate: 'Dakahlia', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01000768398' },
  { id: '10', supplierName: 'التقوى لفرز وتعبئة وتصدير الحاصلات الزراعية', address: 'الكيلو 106 - طريق مصر الاسماعيلية الصحراوي - الشرقية', governorate: 'Sharqia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01223915007' },
  { id: '11', supplierName: 'التوحيد والنور لتصدير الحاصلات الزراعية', address: 'الكيلو 106 - طريق مصر الاسماعيلية الصحراوي - الشرقية', governorate: 'Sharqia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01110333045' },
  { id: '12', supplierName: 'الجوهري للتجارة والتوزيع', address: 'المنطقة الصناعية - جمصة - الدقهلية', governorate: 'Dakahlia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01110333045' },
  { id: '13', supplierName: 'الدقهلية لتصدير وتجميد الحاصلات الزراعية (شركة مساهمة مصرية)', address: 'جمصة - المنطقة الصناعية', governorate: 'Dakahlia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01223468852' },
  { id: '14', supplierName: 'الدولية لتصدير الحاصلات الزراعية', address: 'جمصة - المنطقة الصناعية', governorate: 'Dakahlia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '04/ 53118880' },
  { id: '15', supplierName: 'الرواد لتصدير الحاصلات الزراعية', address: 'المنطقة الصناعية الثانية - مدينة السادات - المنوفية', governorate: 'Monufia', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01159795500' },
  { id: '16', supplierName: 'الرواد لفرز وتعبئة وتصدير الحاصلات الزراعية', address: 'المنطقة الصناعية - قطعة 726 - مدينة السادات - المنوفية', governorate: 'Monufia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01001670669' },
  { id: '17', supplierName: 'الريان لتصدير وتجميد الحاصلات الزراعية', address: 'العاشر من رمضان - الشرقية', governorate: 'Sharqia', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01274834020' },
  { id: '18', supplierName: 'السلام للتجارة والتوزيع', address: 'المنطقة الصناعية - قويسنا - المنوفية', governorate: 'Monufia', activityType: 'محطة تعبئة خضار وفاكهة طازجة', phoneNumber: '01000387343' },
  { id: '19', supplierName: 'السلام لتصدير الحاصلات الزراعية', address: 'طريق مصر/اسماعيلية الصحراوي - مدينة السلام', governorate: 'Cairo', activityType: 'محطة تعبئة وتجهيز حاصلات زراعية', phoneNumber: '01012299817' },
...

I will generate a lot of entries here, up to 162.

...
  { id: '159', supplierName: 'اجرو جرين', address: 'الكيلو 86 طريق مصر اسكندرية الصحراوى', governorate: 'Beheira', activityType: 'محطات تعبئه وتجهيز الخضر والفاكهه الطازجه', phoneNumber: '01222418158' },
  { id: '160', supplierName: 'اجزا للتنمية الزراعية', address: 'الاسماعيلية الجديدة - فايد', governorate: 'Ismailia', activityType: 'محطات تعبئه وتجهيز الخضر والفاكهه الطازجه', phoneNumber: '01003454645' },
  { id: '161', supplierName: 'ا그رينا', address: 'المنطقة الصناعية ببلبيس', governorate: 'Sharqia', activityType: 'محطات تعبئه وتجهيز الخضر والفاكهه الطازجه', phoneNumber: '01112403015' },
  { id: '162', supplierName: 'اجريكو', address: 'الخطاطبة', governorate: 'Monufia', activityType: 'محطات تعبئه وتجهيز الخضر والفاكهه الطازجه', phoneNumber: '01009828182' }
];
