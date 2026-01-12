import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { fetchBillFromSource } from '../services/billService';
import { generateBillPDF } from '../services/pdfService';
import { User, MapPin, Phone, RefreshCw, Download, Share2, Save, ExternalLink, IndianRupee, Zap } from 'lucide-react';
import { Bill } from '../types';

export const UkscDetail: React.FC = () => {
  const { profileId, ukscId } = useParams<{ profileId: string; ukscId: string }>();
  const { data, updateUksc } = useAppStore();
  
  const profile = data.profiles.find(p => p.id === profileId);
  const item = profile?.items.find(i => i.id === ukscId);

  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tenantForm, setTenantForm] = useState(item?.tenant || { name: '', address: '', phone: '' });

  useEffect(() => {
    if (item) setTenantForm(item.tenant);
  }, [item]);

  const handleFetch = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const b = await fetchBillFromSource(item.ukscNumber);
      setBill(b);
    } catch (e) {
      alert("Failed to fetch bill.");
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
    const msg = `*Electricity Bill Notification*\n\nHello ${tenantForm.name || 'Tenant'},\n\nYour electricity bill for UKSC *${item.ukscNumber}* is ready.\n\n*Bill Summary:*\nAmount: ₹${bill.amount}\nDue Date: ${bill.dueDate}\nStatus: ${bill.status}\n\nPlease pay at your earliest convenience.\n\n_Generated via PowerBill Pro_`;
    const phone = tenantForm.phone.replace(/\D/g, '');
    const url = phone.length >= 10 ? `https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (!item) return <div className="p-20 text-center">Not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Tenant & Meter Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Details</h3>
              <button 
                onClick={() => isEditing ? handleSaveTenant() : setIsEditing(true)}
                className={`text-sm font-black px-4 py-2 rounded-xl transition-all ${isEditing ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {isEditing ? 'SAVE' : 'EDIT'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Name</label>
                <h2 className="text-2xl font-black text-blue-600 leading-tight">{item.label}</h2>
                <p className="text-slate-400 font-mono text-xs mt-1">UKSC: {item.ukscNumber}</p>
              </div>

              <div className="pt-6 border-t space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl"><User className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant</p>
                    {isEditing ? (
                      <input 
                        className="w-full mt-1 font-bold outline-none border-b-2 border-blue-600 py-1"
                        value={tenantForm.name}
                        onChange={e => setTenantForm({...tenantForm, name: e.target.value})}
                      />
                    ) : (
                      <p className="font-bold text-slate-800 text-lg leading-tight">{tenantForm.name || 'Not Assigned'}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl"><MapPin className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                    {isEditing ? (
                      <input 
                        className="w-full mt-1 font-bold outline-none border-b-2 border-blue-600 py-1"
                        placeholder="Flat/Plot No"
                        value={tenantForm.address}
                        onChange={e => setTenantForm({...tenantForm, address: e.target.value})}
                      />
                    ) : (
                      <p className="font-bold text-slate-800 text-lg leading-tight">{tenantForm.address || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl"><Phone className="h-5 w-5 text-slate-400" /></div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                    {isEditing ? (
                      <input 
                        className="w-full mt-1 font-bold outline-none border-b-2 border-blue-600 py-1"
                        placeholder="Phone number"
                        value={tenantForm.phone}
                        onChange={e => setTenantForm({...tenantForm, phone: e.target.value})}
                      />
                    ) : (
                      <p className="font-bold text-slate-800 text-lg leading-tight">{tenantForm.phone || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a 
            href={`https://tgsouthernpower.org/billinginfo?ukscno=${item.ukscNumber}`}
            target="_blank"
            className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-black transition-all group"
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="font-bold text-sm">Official Portal</span>
            </div>
            <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
          </a>
        </div>

        {/* RIGHT: Bill Processing */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full min-h-[500px]">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Billing Status</h3>
              <button 
                onClick={handleFetch}
                disabled={loading}
                className="bg-white p-3 rounded-2xl border shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="p-8 flex-grow flex flex-col items-center justify-center text-center">
              {!bill && !loading ? (
                <div className="space-y-6 max-w-sm">
                  <div className="bg-blue-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-10 w-10 text-blue-300" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800">No bill data loaded</h4>
                  <p className="text-slate-400 text-sm">Click the refresh button to fetch the latest billing information for this meter.</p>
                  <button onClick={handleFetch} className="w-full bg-blue-600 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                    Fetch Billing Data
                  </button>
                </div>
              ) : loading ? (
                <div className="space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-50 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Querying TSSPDCL Servers...</p>
                </div>
              ) : bill ? (
                <div className="w-full space-y-8 animate-in zoom-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-8 rounded-[2rem] text-left border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</p>
                      <div className="flex items-center gap-1 text-4xl font-black text-slate-900">
                        <IndianRupee className="h-8 w-8 text-blue-600" />
                        <span>{bill.amount}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] text-left border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <div className={`text-2xl font-black ${bill.status === 'Paid' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {bill.status.toUpperCase()}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">AS OF {bill.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                    <div className="text-left px-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</p>
                      <p className="text-xl font-bold text-slate-800">{bill.units} kWh</p>
                    </div>
                    <div className="text-left px-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                      <p className="text-xl font-bold text-slate-800">{bill.dueDate}</p>
                    </div>
                    <div className="text-left px-4 hidden md:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Date</p>
                      <p className="text-xl font-bold text-slate-800">{bill.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                    <button 
                      onClick={() => generateBillPDF(item, bill)}
                      className="flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-black transition-all shadow-xl shadow-slate-200"
                    >
                      <Download className="h-5 w-5" /> Download PDF
                    </button>
                    <button 
                      onClick={shareToWhatsApp}
                      className="flex items-center justify-center gap-3 bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                    >
                      <Share2 className="h-5 w-5" /> Share WhatsApp
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