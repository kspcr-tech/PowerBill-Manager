import React, { useRef, useState } from 'react';
import { X, Save, Download, Upload, ShieldCheck, Database } from 'lucide-react';
import { useAppStore } from '../store/context';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data, setApiKey, exportData, importData } = useAppStore();
  const [keyInput, setKeyInput] = useState(data.apiKey);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setApiKey(keyInput);
    alert("API Key saved locally.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            System Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          <section>
            <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Gemini API Key
            </label>
            <div className="flex gap-2">
              <input 
                type="password"
                className="flex-grow px-4 py-2 bg-slate-100 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter key..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
              />
              <button onClick={handleSaveKey} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Used for future intelligent bill parsing features.</p>
          </section>

          <section className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Data Portability</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={exportData} className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all group">
                <Download className="h-8 w-8 text-slate-400 group-hover:text-blue-600" />
                <span className="text-xs font-medium text-slate-600">Export Backup</span>
              </button>
              <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
                <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-xs font-medium text-slate-600">Import Data</span>
                <input 
                  type="file" 
                  hidden 
                  ref={fileRef} 
                  accept=".json" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        await importData(file);
                        alert("Data imported successfully!");
                      } catch (err) {
                        alert("Invalid file format.");
                      }
                    }
                  }} 
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};