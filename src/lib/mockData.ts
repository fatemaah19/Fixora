import type { Appliance, Complaint, Customer, ServiceRequest, TimeSlot, TradeId, Worker } from './types';

export const areas = ['Gulgasht','Multan Cantt','Bosan Road','Shah Rukn-e-Alam Colony','New Multan','Model Town','Hussain Agahi','Nawan Shehr','Shujabad Road','Mumtazabad'];
export const trades: { id: TradeId; label: string; labelUr: string }[] = [
  { id: 'electrician', label: 'Electrician', labelUr: 'الیکٹریشن' },
  { id: 'ac', label: 'AC Technician', labelUr: 'اے سی ٹیکنیشن' },
  { id: 'plumber', label: 'Plumber', labelUr: 'پلمبر' },
  { id: 'carpenter', label: 'Carpenter', labelUr: 'کارپنٹر' },
];
export const customers: Customer[] = [
  {id:'c1',name:'محمد احمد',phone:'03001112223',area:'Gulgasht'},
  {id:'c2',name:'علی رضا',phone:'03002223334',area:'Multan Cantt'},
  {id:'c3',name:'فاطمہ نور',phone:'03003334445',area:'Model Town'},
];
export const workers: Worker[] = [
  {id:'w1',name:'محمد عثمان',nameEn:'Muhammad Usman',phone:'03007654321',whatsapp:'03007654321',tradeId:'electrician',experience:9,rating:4.9,reviews:128,area:'Gulgasht',bio:'گھریلو وائرنگ، پنکھے، لائٹس اور بجلی کی خرابی کی مرمت۔',bioEn:'Home wiring, fan and light installation, and electrical fault repairs.',status:'approved',avatar:'MO'},
  {id:'w2',name:'بلال حسین',nameEn:'Bilal Hussain',phone:'03001234001',whatsapp:'03001234001',tradeId:'electrician',experience:6,rating:4.7,reviews:86,area:'Multan Cantt',bio:'وائرنگ، سوئچ بورڈ اور بجلی کے آلات کی مرمت۔',bioEn:'Wiring, switchboard, and electrical appliance repairs.',status:'approved',avatar:'BH'},
  {id:'w3',name:'احمد نواز',nameEn:'Ahmed Nawaz',phone:'03001234002',whatsapp:'03001234002',tradeId:'plumber',experience:12,rating:4.8,reviews:104,area:'Bosan Road',bio:'پائپ لیکیج، نلکے، واش روم اور واٹر موٹر کی مرمت۔',bioEn:'Repairs for pipe leaks, taps, bathrooms, and water pumps.',status:'approved',avatar:'AN'},
  {id:'w4',name:'کاشف اقبال',nameEn:'Kashif Iqbal',phone:'03001234003',whatsapp:'03001234003',tradeId:'plumber',experience:4,rating:4.2,reviews:39,area:'New Multan',bio:'گھریلو پلمبنگ اور پانی کی لائنوں کا کام۔',bioEn:'Home plumbing and water line repairs.',status:'approved',avatar:'KI'},
  {id:'w5',name:'سلمان جاوید',nameEn:'Salman Javed',phone:'03001234004',whatsapp:'03001234004',tradeId:'ac',experience:15,rating:4.9,reviews:151,area:'Model Town',bio:'اے سی سروس، گیس، انسٹالیشن اور کولنگ کے مسائل۔',bioEn:'AC servicing, gas refilling, installation, and cooling repairs.',status:'approved',avatar:'SJ'},
  {id:'w6',name:'زین عباس',nameEn:'Zain Abbas',phone:'03001234005',whatsapp:'03001234005',tradeId:'ac',experience:3,rating:3.8,reviews:21,area:'Mumtazabad',bio:'اے سی صفائی، سروس اور بنیادی مرمت۔',bioEn:'AC cleaning, servicing, and basic repairs.',status:'pending',avatar:'ZA'},
  {id:'w7',name:'عمران اکرم',nameEn:'Imran Akram',phone:'03001234006',whatsapp:'03001234006',tradeId:'carpenter',experience:11,rating:4.6,reviews:73,area:'Shujabad Road',bio:'دروازے، الماریاں، فرنیچر اور لکڑی کا کام۔',bioEn:'Doors, wardrobes, furniture, and other woodwork.',status:'approved',avatar:'IA'},
  {id:'w8',name:'فہد محمود',nameEn:'Fahad Mahmood',phone:'03001234007',whatsapp:'03001234007',tradeId:'carpenter',experience:2,rating:4.1,reviews:17,area:'Shah Rukn-e-Alam Colony',bio:'فرنیچر کی مرمت اور لکڑی کے چھوٹے بڑے کام۔',bioEn:'Furniture repairs and carpentry jobs of all sizes.',status:'rejected',avatar:'FM'},
];
export const requests: ServiceRequest[] = [
  {id:'r1',customerId:'c1',tradeId:'electrician',description:'کمرے کا پنکھا نہیں چل رہا',area:'Gulgasht',status:'booked',workerId:'w1',createdAt:'2026-11-18'},
  {id:'r2',customerId:'c2',tradeId:'plumber',description:'کچن کے نلکے سے پانی لیک ہو رہا ہے',area:'Multan Cantt',status:'requested',createdAt:'2026-11-19'},
  {id:'r3',customerId:'c3',tradeId:'ac',description:'اے سی ٹھنڈا نہیں کر رہا',area:'Model Town',status:'completed',workerId:'w5',createdAt:'2026-11-15'},
  {id:'r4',customerId:'c1',tradeId:'carpenter',description:'دروازے کا قبضہ ٹھیک کروانا ہے',area:'Gulgasht',status:'requested',createdAt:'2026-11-20'},
  {id:'r5',customerId:'c2',tradeId:'electrician',description:'سوئچ بورڈ میں مسئلہ ہے',area:'Multan Cantt',status:'completed',workerId:'w2',createdAt:'2026-11-12'},
  {id:'r6',customerId:'c3',tradeId:'plumber',description:'واش بیسن بند ہے',area:'Model Town',status:'booked',workerId:'w3',createdAt:'2026-11-17'},
  {id:'r7',customerId:'c1',tradeId:'ac',description:'اے سی کی سروس درکار ہے',area:'Gulgasht',status:'cancelled',createdAt:'2026-11-10'},
  {id:'r8',customerId:'c2',tradeId:'carpenter',description:'الماری کا دروازہ درست کرنا ہے',area:'Multan Cantt',status:'requested',createdAt:'2026-11-20'},
  {id:'r9',customerId:'c3',tradeId:'electrician',description:'لائٹ بار بار بند ہو جاتی ہے',area:'Model Town',status:'booked',workerId:'w1',createdAt:'2026-11-16'},
  {id:'r10',customerId:'c1',tradeId:'plumber',description:'موٹر سے پانی نہیں آ رہا',area:'Gulgasht',status:'completed',workerId:'w3',createdAt:'2026-11-08'},
];
export const timeSlots: TimeSlot[] = Array.from({length: 24}, (_, i) => ({
  id:`s${i+1}`, workerId:`w${(i%5)+1}`, date:`2026-11-${String(21+Math.floor(i/8)).padStart(2,'0')}`,
  start:['09:00','11:00','14:00','16:00'][i%4], end:['10:00','12:00','15:00','17:00'][i%4], booked:i%5===0,
}));
export const complaints: Complaint[] = [
  {id:'cp1',customerId:'c1',bookingId:'r1',message:'کام مکمل ہونے میں تاخیر ہوئی۔',status:'open'},
  {id:'cp2',customerId:'c2',bookingId:'r5',message:'قیمت پہلے نہیں بتائی گئی۔',status:'resolved',response:'معذرت، متعلقہ کاریگر کو ہدایت دے دی گئی ہے۔'},
];
export const appliances: Appliance[] = [
  {id:'a1',customerId:'c1',name:'ایئر کنڈیشنر',brand:'Haier',warrantyUntil:'2027-06-30',history:['2026-06-12 — سالانہ سروس']},
  {id:'a2',customerId:'c1',name:'واٹر ڈسپنسر',brand:'Dawlance',warrantyUntil:'2027-02-15',history:['2026-02-20 — کولنگ چیک']},
  {id:'a3',customerId:'c2',name:'واشنگ مشین',brand:'Samsung',warrantyUntil:'2028-01-10',history:['2026-09-04 — ڈرین پائپ کی مرمت']},
];
