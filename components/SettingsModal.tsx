import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/context';
import { Save, Download, Upload, AlertCircle, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, exportData, importData } = useAppStore();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(keyInput);
    setMessage({ type: 'success', text: 'API Key saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        setMessage({ type: 'success', text: 'Data imported successfully!' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to import data. Invalid file.' });
      }
      setTimeout(() => setMessage(null), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">App Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* API Key Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              API Configuration
            </h3>
            <form onSubmit={handleSaveKey} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Gemini API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter your API Key..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your API key is stored locally on this device.
              </p>
            </form>
          </section>

          {/* Data Management Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
              Data Management
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={exportData}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Download className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Export Backup</span>
              </button>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
              >
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Import Backup</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Importing data will merge or replace existing profiles.
            </p>
          </section>

          {/* Feedback Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <Save className="h-4 w-4" /> 
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
