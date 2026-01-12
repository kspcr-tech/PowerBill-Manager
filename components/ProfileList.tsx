import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { Home, Building2, Plus, Trash2, ChevronRight } from 'lucide-react';
import { PropertyType } from '../types';

export const ProfileList: React.FC = () => {
  const { data, addProfile, deleteProfile } = useAppStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<PropertyType>('home');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addProfile(name, type);
      setName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Properties</h1>
          <p className="text-slate-500">Manage your meters across different sites.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 font-semibold"
        >
          <Plus className="h-5 w-5" /> New Site
        </button>
      </div>

      {data.profiles.length === 0 ? (
        <div className="bg-white border-2 border-dashed rounded-3xl p-16 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No properties yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by adding your home or apartment complexes to organize your meters.</p>
          <button onClick={() => setIsAdding(true)} className="text-blue-600 font-bold hover:underline">Add your first property &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.profiles.map(profile => (
            <div 
              key={profile.id}
              onClick={() => navigate(`/profile/${profile.id}`)}
              className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${profile.type === 'home' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                  {profile.type === 'home' ? <Home className="h-7 w-7" /> : <Building2 className="h-7 w-7" />}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Delete this site and all its meters?")) deleteProfile(profile.id);
                  }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{profile.name}</h3>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">{profile.type}</p>
              
              <div className="mt-auto pt-6 border-t flex justify-between items-center">
                <span className="text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-full">
                  {profile.items.length} {profile.items.length === 1 ? 'Meter' : 'Meters'}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-bold mb-6">Add Property</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Property Name</label>
                <input 
                  autoFocus
                  className="w-full px-5 py-3 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                  placeholder="e.g. My Villa, Skyline Apartment"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setType('home')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'home' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-inner' : 'border-slate-100 text-slate-400'}`}
                >
                  <Home className="h-6 w-6" />
                  <span className="text-sm font-bold uppercase">Home</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setType('apartment')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'apartment' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-inner' : 'border-slate-100 text-slate-400'}`}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-bold uppercase">Apartment</span>
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};