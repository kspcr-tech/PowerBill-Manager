import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { fetchBillFromSource } from '../services/billService';
import { generateBillPDF } from '../services/pdfService';
import { User, MapPin, Phone, RefreshCw, Download, Share2, ExternalLink, IndianRupee, Zap, AlertCircle } from 'lucide-react';
import { Bill } from '../types';

export const UkscDetail: React.FC = () => {
  const { profileId, ukscId } = useParams<{ profileId: string; ukscId: string }>();
  const { data, updateUksc } = useAppStore();
  
  const profile = data.profiles.find(p => p.id === profileId);
  const item = profile?.items.find(i => i.id === ukscId);

  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(item?.lastBill || null);
  const [isEditing, setIsEditing] = useState(false);
  const [tenantForm, setTenantForm] = useState(item?.tenant || { name: '', address: '', phone: '' });

  useEffect(() => {
    if (item) {
      setTenantForm(item.tenant);
      if (item.lastBill) setBill(item.lastBill);
    }
  }, [item]);

  const handleFetch = async () => {
    if (!item || !profileId || !ukscId) return;
    setLoading(true);
    try {
      const b = await fetchBillFromSource(item.ukscNumber);
      setBill(b);
      // Persist the fetched bill
      updateUksc(profileId, ukscId, { lastBill: b });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTenant = () => {
    if (!profileId || !ukscId) return;
    updateUksc(profileId, ukscId, { tenant: tenantForm });
    setIsEditing(false);
  };

  const shareToWhatsApp = () => {
    if (!bill || !item) return;
    const msg = `*Electricity Bill Notification*\n\nHello ${tenantForm.name || 'Tenant'},\n\nYour electricity bill for UKSC *${item.ukscNumber}* is ready.\n\n*Bill Summary:*\nAmount: ₹${bill.amount}\nDue Date: ${bill.dueDate}\nStatus: ${bill.status}\n\n_Generated via PowerBill Pro_`;
    const cleanPhone = tenantForm.phone.replace(/\D/g, '');
    const url = cleanPhone.length >= 10 
      ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(msg)}` 
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (!item) return <div className="p-20 text-center font-bold text-slate-400">Meter not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Tenant & Meter Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property Details</h3>
              <button 
                onClick={() => isEditing ? handleSaveTenant() : setIsEditing(true)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${isEditing ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {isEditing ? 'SAVE CHANGES' : 'EDIT INFO'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{item.label}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">UKSC {item.ukscNumber}</span>
                </div>
              </div>

              <div className="pt-6 border-t space-y-5">
                {[
                  { label: 'Tenant Name', value: tenantForm.name, icon: User, key: 'name', placeholder: 'Enter name' },
                  { label: 'Address / Plot', value: tenantForm.address, icon: MapPin, key: 'address', placeholder: 'Flat or Plot No.' },
                  { label: 'Phone Number', value: tenantForm.phone, icon: Phone, key: 'phone', placeholder: 'WhatsApp number' }
                ].map((field) => (
                  <div key={field.label} className="flex gap-4 items-start">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                      <field.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{field.label}</p>
                      {isEditing ? (
                        <input 
                          className="w-full font-semibold outline-none border-b border-blue-200 focus:border-blue-600 py-0.5 transition-colors text-slate-800"
                          value={field.value}
                          placeholder={field.placeholder}
                          onChange={e => setTenantForm({...tenantForm, [field.key]: e.target.value})}
                        />
                      ) : (
                        <p className="font-bold text-slate-800 truncate">{field.value || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] p-6 border border-blue-100">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Direct fetching from TSSPDCL is restricted by browser security. Use the link below to verify on the official site.
              </p>
            </div>
            <a 
              href={`https://tgsouthernpower.org/billinginfo?ukscno=${item.ukscNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all border border-blue-200"
            >
              Open Official Portal <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* RIGHT: Bill Processing */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full min-h-[450px]">
            <div className="px-8 py-6 border-b bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill Summary</h3>
              <button 
                onClick={handleFetch}
                disabled={loading}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all disabled:opacity-50 text-xs font-bold text-blue-600"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'REFRESHING...' : 'REFRESH BILL'}
              </button>
            </div>

            <div className="p-8 flex-grow flex flex-col items-center justify-center text-center">
              {!bill && !loading ? (
                <div className="space-y-6 max-w-sm">
                  <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-slate-200" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Ready to Fetch</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Load the latest billing information for this meter using the refresh button.</p>
                </div>
              ) : loading ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Service Data...</p>
                </div>
              ) : bill ? (
                <div className="w-full space-y-8 animate-in zoom-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-8 rounded-[2rem] text-left border border-slate-100 flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Outstanding</p>
                      <div className="flex items-end gap-1">
                        <span className="text-blue-600 text-2xl font-bold mb-1">₹</span>
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{bill.amount}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] text-left border border-slate-100 flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Status</p>
                      <div className={`text-3xl font-black tracking-tight ${bill.status === 'Paid' ? 'text-emerald-600' : 'text-orange-500'}`}>
                        {bill.status.toUpperCase()}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">UPDATED: {bill.date}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Units Consumed</p>
                      <p className="text-lg font-bold text-slate-800">{bill.units} kWh</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-lg font-bold text-slate-800">{bill.dueDate}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                      <p className="text-lg font-bold text-slate-800">LT-I Domestic</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => generateBillPDF(item, bill)}
                      className="flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-200"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                    <button 
                      onClick={shareToWhatsApp}
                      className="flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      <Share2 className="h-4 w-4" /> Share to WhatsApp
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};