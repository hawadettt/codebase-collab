
export type NfsaSupplierSample = {
  supplierName: string;
  governorate: string;
  activityType: string;
  products: string[];
  approvalDate: string;
  status: 'ساري' | 'موقوف';
};

// Data transcribed from https://nfsa.gov.eg/Images/App_PP/DeskTop/App_Web/1/MyWebMedia/PDF/MW01.pdf
export const nfsaPackingStations: NfsaSupplierSample[] = [
  {
    "supplierName": "اجرو مصر لتصنيع وتعبئة الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف وتجميد الخضار والفاكهة",
    "products": ["الفاصوليا الخضراء", "البسلة", "الخرشوف", "السبانخ", "الملوخية", "البامية", "الفلفل", "الفراولة", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "اجريفروست",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة وتجميد الخضروات والفاكهة",
    "products": ["الفراولة", "البروكلي", "الفاصوليا الخضراء"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "اجرين للتنمية الزراعية",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["العنب", "البرتقال"],
    "approvalDate": "2023-01-12",
    "status": "ساري"
  },
  {
    "supplierName": "إمكو تريد",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال الصيفي", "البرتقال أبو سرة", "اليوسفي", "الليمون", "الجريب فروت", "الرمان"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "الأفق الجديدة للتنمية الزراعية والتصنيع الزراعى",
    "governorate": "الإسماعيلية",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-02-23",
    "status": "ساري"
  },
  {
    "supplierName": "الاهرام للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة وتجميد خضروات وفاكهة",
    "products": ["الفراولة", "الفاصوليا الخضراء", "البسلة", "الخرشوف", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "الانصار لتصدير الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["برتقال", "يوسفي", "ليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "البركة تريد",
    "governorate": "الغربية",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-02-12",
    "status": "ساري"
  },
  {
    "supplierName": "التقوى للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["برتقال", "ليمون", "يوسفي"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "التيسير لتصدير الحاصلات الزراعية",
    "governorate": "الغربية",
    "activityType": "تعبئة وفرز الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-02-13",
    "status": "ساري"
  },
  {
    "supplierName": "الجوهري للتجارة الدولية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-01-29",
    "status": "ساري"
  },
  {
    "supplierName": "الحجاز لفرز وتعبئة الخضر والفاكهة",
    "governorate": "الغربية",
    "activityType": "تعبئة وفرز الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "العنب"],
    "approvalDate": "2023-01-29",
    "status": "ساري"
  },
  {
    "supplierName": "الرحمن تريد",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-09",
    "status": "ساري"
  },
  {
    "supplierName": "الرحمة لتصدير وتعبئة الحاصلات الزراعية",
    "governorate": "الشرقية",
    "activityType": "تعبئة الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "الزعيم",
    "governorate": "البحيرة",
    "activityType": "محطات فرز وتعبئة الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "الزهراء للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "الشروق الحديثة",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة وتجميد خضروات وفاكهة",
    "products": ["الفراولة", "الفاصوليا الخضراء", "البسلة", "الخرشوف", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "الشيماء للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["برتقال", "يوسفي", "ليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "العالمية لتصدير الحاصلات الزراعية",
    "governorate": "المنوفية",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-01-12",
    "status": "sari"
  },
  {
    "supplierName": "الفيروز لتصدير وتعبئة الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-04-12",
    "status": "ساري"
  },
  {
    "supplierName": "الماسة للتجارة والتوزيع",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "المالكية للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "المحمدية لتصدير الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "المصرية الهولندية للتنمية الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة وتجميد الخضار والفاكهة",
    "products": ["البصل الأخضر", "الكرفس", "الشبت", "البقدونس", "النعناع", "الجرجير", "الفجل", "الكرنب", "القرنبيط", "البروكلي"],
    "approvalDate": "2023-03-07",
    "status": "ساري"
  },
  {
    "supplierName": "المنصور لتصدير الحاصلات الزراعية",
    "governorate": "الغربية",
    "activityType": "تعبئة وفرز الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-01-29",
    "status": "ساري"
  },
  {
    "supplierName": "النور والهدى",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "الهدى للحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "الوفاء للتصدير والاستيراد",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-09",
    "status": "ساري"
  },
  {
    "supplierName": "أم القرى",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "ايكا اجري",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "بافلى فروت",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "برادايس",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "جرين فود",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتجميد الخضر والفاكهة",
    "products": ["الفراولة", "الخرشوف", "الفاصوليا الخضراء", "البسلة", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "جرين هاوس",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-09",
    "status": "ساري"
  },
  {
    "supplierName": "جنة لتصدير الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "رويال فروت",
    "governorate": "البحيرة",
    "activityType": "تعبئة الخضار والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "زين فريش فروت",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "سوناك",
    "governorate": "الإسكندرية",
    "activityType": "تعبئة وتجميد الخضر والفاكهة",
    "products": ["الفراولة", "الخرشوف", "الفاصوليا الخضراء", "البسلة", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "شركة اجرو ايجيبت",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة وتجميد الخضر والفاكهة",
    "products": ["الفراولة", "البروكلي", "الفاصوليا الخضراء"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "شركة اجزماك",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "شركة ايسكيل",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "شركة بسملة تريد",
    "governorate": "الغربية",
    "activityType": "تعبئة وفرز الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-02-13",
    "status": "ساري"
  },
  {
    "supplierName": "شركة تبارك",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "شركة تريد لاين",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "شركة جاردينو",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "شركة جرين",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "شركة جرين فالي",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "شركة دلتا",
    "governorate": "الغربية",
    "activityType": "تعبئة وفرز الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي"],
    "approvalDate": "2023-02-13",
    "status": "ساري"
  },
  {
    "supplierName": "شركة رووتس",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "شركة سان جواد",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-12",
    "status": "ساري"
  },
  {
    "supplierName": "شركة سينا",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "شركة فريدة",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتجميد الخضر والفاكهة",
    "products": ["الفراولة", "الخرشوف", "الفاصوليا الخضراء", "البسلة", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "شركة فروت فالى",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "شركة فريش",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-23",
    "status": "ساري"
  },
  {
    "supplierName": "شركة فريش لاند",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة الخضر والفاكهة الطازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "شركة كيميت",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "شركة نيو فروت",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "عرفة جروب",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "فروتكس",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "فور إم",
    "governorate": "البحيرة",
    "activityType": "محطة فرز وتعبئة خضر وفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "فى اى بى اجري",
    "governorate": "البحيرة",
    "activityType": "تعبئة خضر وفاكهة طازجة",
    "products": ["البرتقال", "اليوسفي", "الليمون", "الرمان"],
    "approvalDate": "2023-05-18",
    "status": "ساري"
  },
  {
    "supplierName": "فيتا فروت",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "كادبيري",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتجميد الخضر والفاكهة",
    "products": ["الفراولة", "الخرشوف", "الفاصوليا الخضراء", "البسلة", "السبانخ", "الملوخية", "البامية", "الفلفل", "المشمش", "الخوخ"],
    "approvalDate": "2023-01-16",
    "status": "ساري"
  },
  {
    "supplierName": "كيرو فروت",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "لوتس",
    "governorate": "البحيرة",
    "activityType": "تعبئة وتغليف الخضروات والفاكهة الطازجة",
    "products": ["البرتقال", "الليمون", "اليوسفي"],
    "approvalDate": "2023-03-27",
    "status": "ساري"
  },
  {
    "supplierName": "مكة لفرز وتعبئة الحاصلات الزراعية",
    "governorate": "البحيرة",
    "activityType": "فرز وتعبئة الخضر والفاكهة",
    "products": ["البرتقال", "اليوسفي", "الليمون"],
    "approvalDate": "2023-05-09",
    "status": "ساري"
  }
];
