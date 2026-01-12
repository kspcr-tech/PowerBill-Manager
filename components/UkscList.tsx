import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { Plus, Edit3, Trash2, FileText, Search, LayoutGrid } from 'lucide-react';

export const UkscList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, addUkscBulk, updateUksc, removeUksc } = useAppStore();
  const profile = data.profiles.find(p => p.id === id);

  const [isAdding, setIsAdding] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (!profile) return <div>Profile not found.</div>;

  const filteredItems = profile.items.filter(item => 
    item.ukscNumber.includes(search) || item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nums = bulkInput.split(/[,\n]/).filter(s => s.trim().length > 0);
    if (nums.length) {
      addUkscBulk(profile.id, nums);
      setBulkInput('');
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{profile.name}</h2>
          <p className="text-slate-500 font-medium">Managing {profile.items.length} Service Numbers</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              className="pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              placeholder="Search meters..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" /> Bulk Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            onClick={() => navigate(`/profile/${profile.id}/uksc/${item.id}`)}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all group cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Remove this meter?")) removeUksc(profile.id, item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingId === item.id ? (
              <div className="space-y-3" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={item.label}
                  onChange={e => updateUksc(profile.id, item.id, { label: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                />
                <input 
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  value={item.ukscNumber}
                  onChange={e => updateUksc(profile.id, item.id, { ukscNumber: e.target.value })}
                  onBlur={() => setEditingId(null)}
                />
              </div>
            ) : (
              <>
                <h4 className="text-xl font-black text-slate-800 mb-1 leading-tight group-hover:text-blue-700 transition-colors">{item.label}</h4>
                <p className="text-slate-400 font-mono text-xs tracking-widest mb-4">UKSC: {item.ukscNumber}</p>
              </>
            )}

            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">
                {item.tenant.name || 'UNASSIGNED'}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-2">Bulk Add Meters</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Add multiple UKSC numbers separated by commas or new lines.</p>
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <textarea 
                autoFocus
                className="w-full h-48 px-5 py-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono text-sm leading-relaxed"
                placeholder="110390320, 110390321&#10;110390322"
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">Import Numbers</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};