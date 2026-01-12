import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { Plus, Edit2, ChevronLeft, Search, FileText } from 'lucide-react';

const UkscList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, addUkscToProfile, updateUksc, removeUksc } = useAppStore();
  
  const profile = profiles.find((p) => p.id === id);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ukscInput, setUkscInput] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string, label: string } | null>(null);

  if (!profile) {
    return <div className="text-center py-10">Profile not found</div>;
  }

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ukscInput.trim()) return;

    // Split by comma or newline
    const numbers = ukscInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (numbers.length > 0) {
      addUkscToProfile(profile.id, numbers);
      setUkscInput('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editingItem.label.trim()) {
      updateUksc(profile.id, editingItem.id, { label: editingItem.label });
      setEditingItem(null);
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (e: React.MouseEvent, item: { id: string, label: string }) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-sm text-gray-500">{profile.type === 'home' ? 'Home' : 'Apartment'} • {profile.items.length} meters</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search UKSC number or tenant..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Add UKSC No.</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.items.map((item) => (
          <div 
            key={item.id}
            onClick={() => navigate(`/profile/${profile.id}/uksc/${item.id}`)}
            className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <button
                  onClick={(e) => openEditModal(e, { id: item.id, label: item.label })}
                  className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-1">{item.label}</h3>
              <p className="text-gray-500 text-sm font-mono bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-100 mb-3">
                {item.ukscNumber}
              </p>

              <div className="border-t border-gray-100 pt-3 mt-1">
                 {item.tenant.name ? (
                   <div className="flex flex-col text-sm">
                     <span className="text-gray-900 font-medium">{item.tenant.name}</span>
                     <span className="text-gray-500">{item.tenant.flatOrPlotNo || 'No flat #'}</span>
                   </div>
                 ) : (
                   <span className="text-sm text-gray-400 italic">No tenant details added</span>
                 )}
              </div>
            </div>
            
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Delete this UKSC number?")) removeUksc(profile.id, item.id);
                  }}
                  className="bg-white/90 text-red-500 hover:text-red-700 p-1.5 rounded-full shadow-sm hover:shadow"
                >
                    <span className="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {profile.items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No UKSC numbers added yet.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 hover:underline mt-2">Add numbers now</button>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-2">Add UKSC Numbers</h2>
            <p className="text-gray-500 text-sm mb-4">Enter multiple numbers separated by commas or new lines.</p>
            <form onSubmit={handleBulkAdd}>
              <textarea
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 font-mono text-sm"
                placeholder="110390320, 110390321&#10;110390322"
                value={ukscInput}
                onChange={(e) => setUkscInput(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!ukscInput.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Numbers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Label Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-4">Edit Name</h2>
            <form onSubmit={handleEditLabel}>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                value={editingItem.label}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UkscList;
