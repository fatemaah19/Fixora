'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/contexts/LanguageProvider';
import { getAppliances } from '@/lib/api';
import { localizedText } from '@/lib/localization';
import type { Appliance } from '@/lib/types';
import { ShieldCheck, Plus, CalendarClock, History } from 'lucide-react';

export default function PassportPage() {
  const { language } = useT();
  const ur = language === 'ur';
  const [items, setItems] = useState<Appliance[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [warranty, setWarranty] = useState('');

  useEffect(() => {
    const saved: Appliance[] = JSON.parse(localStorage.getItem('fixora-local-appliances') || '[]');
    getAppliances('c1').then((base) => setItems([...base, ...saved]));
  }, []);

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    const item: Appliance = {
      id: `ap-${Date.now()}`,
      customerId: 'c1',
      name,
      nameEn: ur ? undefined : name,
      brand,
      warrantyUntil: warranty || '—',
      history: [],
      historyEn: [],
    };
    const saved: Appliance[] = JSON.parse(localStorage.getItem('fixora-local-appliances') || '[]');
    localStorage.setItem('fixora-local-appliances', JSON.stringify([item, ...saved]));
    setItems((previous) => [item, ...previous]);
    setShow(false);
    setName('');
    setBrand('');
    setWarranty('');
  };

  return <div>
    <div className="fx-page-heading fx-heading-split"><div><span className="fx-eyebrow">HOME PASSPORT</span><h1>{ur ? 'ہوم پاسپورٹ' : 'Home Passport'}</h1><p>{ur ? 'اپنے گھر کے آلات، وارنٹی اور مرمت کا ریکارڈ محفوظ کریں۔' : 'A digital record of your appliances, warranties, and maintenance.'}</p></div><button className="fx-primary-btn" onClick={() => setShow(true)}><Plus size={17} />{ur ? 'آلہ شامل کریں' : 'Add appliance'}</button></div>
    <div className="fx-passport-summary"><div><ShieldCheck size={26} /><span>{ur ? 'محفوظ آلات' : 'Saved appliances'}</span><strong>{items.length}</strong></div><div><CalendarClock size={26} /><span>{ur ? 'وارنٹی ریکارڈ' : 'Warranty records'}</span><strong>{items.filter((item) => item.warrantyUntil && item.warrantyUntil !== '—').length}</strong></div><div><History size={26} /><span>{ur ? 'مرمت کی ہسٹری' : 'Service history'}</span><strong>{items.reduce((sum, item) => sum + item.history.length, 0)}</strong></div></div>
    <div className="fx-appliance-grid">{items.map((item) => {
      const displayName = localizedText(language, item.name, item.nameEn, 'Appliance name entered in Urdu');
      const history = item.history.map((entry, index) => localizedText(language, entry, item.historyEn?.[index], 'Service details entered in Urdu.'));
      return <article className="fx-appliance-card" key={item.id}><div className="fx-appliance-art">{displayName.toLowerCase().includes('air') || displayName.includes('ایئر') ? '❄️' : displayName.toLowerCase().includes('water') || displayName.includes('واٹر') ? '🚰' : '🔌'}</div><div className="fx-appliance-content"><h3>{displayName}</h3><p>{item.brand}</p><div className="fx-warranty-line"><CalendarClock size={15} /><span>{ur ? 'وارنٹی ختم ہونے کی تاریخ:' : 'Warranty until:'} {item.warrantyUntil}</span></div><div className="fx-history"><strong>{ur ? 'مرمت کی ہسٹری' : 'Service history'}</strong>{history.length ? history.map((entry, index) => <p key={index}>{entry}</p>) : <p>{ur ? 'ابھی کوئی ریکارڈ نہیں' : 'No service history yet'}</p>}</div></div></article>;
    })}</div>
    {show && <div className="fx-modal-backdrop" onClick={() => setShow(false)}><div className="fx-modal" onClick={(event) => event.stopPropagation()}><button className="fx-modal-close" onClick={() => setShow(false)}>×</button><h2>{ur ? 'نیا آلہ شامل کریں' : 'Add an appliance'}</h2><form onSubmit={add} className="fx-modal-form"><label>{ur ? 'آلے کا نام' : 'Appliance name'}<input className="form-input" value={name} onChange={(event) => setName(event.target.value)} required placeholder={ur ? 'مثلاً فریج' : 'e.g. Refrigerator'} /></label><label>{ur ? 'برانڈ' : 'Brand'}<input className="form-input" value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="e.g. Dawlance" /></label><label>{ur ? 'وارنٹی کی تاریخ' : 'Warranty expiry date'}<input className="form-input" type="date" value={warranty} onChange={(event) => setWarranty(event.target.value)} /></label><button className="fx-primary-btn full" type="submit">{ur ? 'محفوظ کریں' : 'Save appliance'}</button></form></div></div>}
  </div>;
}
