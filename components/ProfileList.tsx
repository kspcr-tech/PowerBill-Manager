import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/context';
import { Plus, Home, Building2, Trash2, ArrowRight } from 'lucide-react';
import { ProfileType } from '../types';

const ProfileList: React.FC = () => {
  const { profiles, addProfile, deleteProfile } = useAppStore();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState<ProfileType>('home');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      addProfile(newProfileName, newProfileType);
      setNewProfileName('');
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
          <p className="text-gray-500">Manage your homes and apartments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Property</span>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
          <p className="text-gray-500 mb-6">Create a profile to start tracking bills.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-medium hover:underline"
          >
            Create your first property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
            >
              <div 
                className="p-6 cursor-pointer flex-grow"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${profile.type === 'home' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                    {profile.type === 'home' ? <Home className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    {profile.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                <p className="text-gray-500 text-sm">{profile.items.length} UKSC Numbers</p>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Are you sure you want to delete this profile?')) deleteProfile(profile.id);
                  }}
                  className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button 
                   onClick={() => navigate(`/profile/${profile.id}`)}
                   className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View Details <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">Add New Property</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riverside Apartment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewProfileType('home')}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-all ${newProfileType === 'home' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProfileType('apartment')}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-all ${newProfileType === 'apartment' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    Apartment
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileList;
