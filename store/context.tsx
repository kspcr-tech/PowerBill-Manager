import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, AppData, PropertyType, UkscItem, Tenant } from '../types';

interface ContextType {
  data: AppData;
  setApiKey: (key: string) => void;
  addProfile: (name: string, type: PropertyType) => void;
  deleteProfile: (id: string) => void;
  addUkscBulk: (profileId: string, numbers: string[]) => void;
  updateUksc: (profileId: string, ukscId: string, updates: Partial<UkscItem>) => void;
  removeUksc: (profileId: string, ukscId: string) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}

const AppContext = createContext<ContextType | undefined>(undefined);

const STORAGE_KEY = 'powerbill_manager_v2';

// Fallback for environments without crypto.randomUUID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { profiles: [], apiKey: '' };
    } catch (e) {
      console.error("Failed to parse storage", e);
      return { profiles: [], apiKey: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setApiKey = (apiKey: string) => setData(prev => ({ ...prev, apiKey }));

  const addProfile = (name: string, type: PropertyType) => {
    const newProfile: Profile = {
      id: generateId(),
      name,
      type,
      items: []
    };
    setData(prev => ({ ...prev, profiles: [...prev.profiles, newProfile] }));
  };

  const deleteProfile = (id: string) => {
    setData(prev => ({ ...prev, profiles: prev.profiles.filter(p => p.id !== id) }));
  };

  const addUkscBulk = (profileId: string, numbers: string[]) => {
    setData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== profileId) return p;
        const newItems: UkscItem[] = numbers.map(num => ({
          id: generateId(),
          ukscNumber: num.trim(),
          label: `Meter ${num.trim().slice(-4)}`,
          tenant: { name: '', address: '', phone: '' }
        }));
        return { ...p, items: [...p.items, ...newItems] };
      })
    }));
  };

  const updateUksc = (profileId: string, ukscId: string, updates: Partial<UkscItem>) => {
    setData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== profileId) return p;
        return {
          ...p,
          items: p.items.map(item => item.id === ukscId ? { ...item, ...updates } : item)
        };
      })
    }));
  };

  const removeUksc = (profileId: string, ukscId: string) => {
    setData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== profileId) return p;
        return { ...p, items: p.items.filter(item => item.id !== ukscId) };
      })
    }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PowerBill_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.profiles) {
            setData(imported);
            resolve();
          } else {
            reject(new Error("Invalid format"));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <AppContext.Provider value={{ data, setApiKey, addProfile, deleteProfile, addUkscBulk, updateUksc, removeUksc, exportData, importData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};