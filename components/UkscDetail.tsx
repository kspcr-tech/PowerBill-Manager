import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { TenantDetails, BillDetails } from '../types';
import { fetchBillDetails } from '../services/billService';
import { generateBillPDF } from '../services/pdfService';
import { ChevronLeft, User, MapPin, Phone, RefreshCw, Download, Share2, Save, FileText } from 'lucide-react';

const UkscDetail: React.FC = () => {
  const { profileId, ukscId } = useParams<{ profileId: string; ukscId: string }>();
  const navigate = useNavigate();
  const { profiles, updateTenantDetails } = useAppStore();

  const profile = profiles.find((p) => p.id === profileId);
  const ukscItem = profile?.items.find((i) => i.id === ukscId);

  const [tenantForm, setTenantForm] = useState<TenantDetails>({
    name: '',
    flatOrPlotNo: '',
    phone: '',
  });

  const [bill, setBill] = useState<BillDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditingTenant, setIsEditingTenant] = useState(false);

  useEffect(() => {
    if (ukscItem) {
      setTenantForm(ukscItem.tenant);
      loadBill(ukscItem.ukscNumber);
    }
  }, [ukscItem]);

  const loadBill = async (ukscNo: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchBillDetails(ukscNo);
      setBill(data);
    } catch (err) {
      setError('Failed to fetch bill details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileId && ukscId) {
      updateTenantDetails(profileId, ukscId, tenantForm);
      setIsEditingTenant(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!bill || !ukscItem) return;
    
    // Format the message
    const message = `*Electricity Bill Alert*\n\nHello ${tenantForm.name || 'Tenant'},\nHere is the electricity bill details for UKSC: ${ukscItem.ukscNumber}.\n\n*Amount: ₹${bill.amount}*\nDue Date: ${bill.dueDate}\nUnits: ${bill.unitsConsumed}\n\nPlease pay before the due date to avoid penalties.\n\n_Generated via PowerBill Manager_`;
    
    const encodedMessage = encodeURIComponent(message);
    const phone = tenantForm.phone.replace(/\D/g, ''); // Remove non-digits
    
    // Use wa.me link. If phone is present, target specific user, else generic share
    const url = phone.length >= 10 
      ? `https://wa.me/91${phone.slice(-10)}?text=${encodedMessage}` 
      : `https://wa.me/?text=${encodedMessage}`;
      
    window.open(url, '_blank');
  };

  const handleDownloadPDF = () => {
    if (ukscItem && bill) {
      generateBillPDF(ukscItem, bill);
    }
  };

  if (!profile || !ukscItem) {
    return <div>Item not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <button 
        onClick={() => navigate(`/profile/${profileId}`)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back to {profile.name}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Tenant Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Tenant Details</h2>
              <button 
                onClick={() => setIsEditingTenant(!isEditingTenant)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isEditingTenant ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingTenant ? (
              <form onSubmit={handleSaveTenant} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tenant Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter name"
                      value={tenantForm.name}
                      onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Flat / Plot No</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="e.g. 102 or Plot 45"
                      value={tenantForm.flatOrPlotNo}
                      onChange={(e) => setTenantForm({...tenantForm, flatOrPlotNo: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone (India)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="9876543210"
                      value={tenantForm.phone}
                      onChange={(e) => setTenantForm({...tenantForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save Details
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="bg-gray-100 p-2 rounded-full"><User className="h-5 w-5 text-gray-600" /></div>
                   <div>
                     <p className="text-xs text-gray-500">Name</p>
                     <p className="font-medium text-gray-900">{ukscItem.tenant.name || 'Not set'}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="bg-gray-100 p-2 rounded-full"><MapPin className="h-5 w-5 text-gray-600" /></div>
                   <div>
                     <p className="text-xs text-gray-500">Address</p>
                     <p className="font-medium text-gray-900">{ukscItem.tenant.flatOrPlotNo || 'Not set'}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="bg-gray-100 p-2 rounded-full"><Phone className="h-5 w-5 text-gray-600" /></div>
                   <div>
                     <p className="text-xs text-gray-500">Phone</p>
                     <p className="font-medium text-gray-900">{ukscItem.tenant.phone || 'Not set'}</p>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Bill Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">{ukscItem.label}</h2>
                 <p className="text-gray-500 font-mono text-sm">UKSC: {ukscItem.ukscNumber}</p>
               </div>
               <button 
                  onClick={() => loadBill(ukscItem.ukscNumber)}
                  disabled={loading}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                  title="Refresh Bill"
               >
                 <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
               </button>
             </div>

             <div className="p-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                     <p className="text-gray-500">Fetching latest bill details from TSSPDCL...</p>
                  </div>
                ) : bill ? (
                   <div className="space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-blue-50 p-4 rounded-xl">
                         <p className="text-blue-600 text-xs font-semibold uppercase mb-1">Total Amount</p>
                         <p className="text-2xl font-bold text-gray-900">₹{bill.amount}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-xl">
                         <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Units Consumed</p>
                         <p className="text-2xl font-bold text-gray-900">{bill.unitsConsumed}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-xl">
                         <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Bill Date</p>
                         <p className="text-lg font-bold text-gray-900">{bill.billingDate}</p>
                       </div>
                       <div className={`p-4 rounded-xl ${bill.status === 'Paid' ? 'bg-green-50' : 'bg-orange-50'}`}>
                         <p className={`text-xs font-semibold uppercase mb-1 ${bill.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>Status</p>
                         <p className={`text-lg font-bold ${bill.status === 'Paid' ? 'text-green-700' : 'text-orange-700'}`}>{bill.status}</p>
                       </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={handleDownloadPDF}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-gray-200"
                        >
                          <Download className="h-5 w-5" />
                          <span>Download PDF</span>
                        </button>
                        <button
                          onClick={handleWhatsAppShare}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-100"
                        >
                          <Share2 className="h-5 w-5" />
                          <span>Share on WhatsApp</span>
                        </button>
                     </div>
                     
                     <p className="text-center text-xs text-gray-400 mt-2">
                       * To share the PDF on WhatsApp, please download it first, then attach it to the message.
                     </p>
                   </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No bill details available. Click refresh to fetch.</p>
                  </div>
                )}
             </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
             <div className="shrink-0 pt-1"><RefreshCw className="h-4 w-4 text-blue-600" /></div>
             <p className="text-sm text-blue-800">
               Data is fetched from <strong>tgsouthernpower.org</strong>. If fetching fails, ensure you have an active internet connection. 
               <br/><span className="text-xs opacity-75">(Note: Due to browser security restrictions (CORS), actual fetching from the 3rd party site might be simulated in this demo).</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UkscDetail;
