import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Profile, ProfileType, UkscItem, TenantDetails } from '../types';

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY_PROFILES = 'powerbill_manager_data_v1';
const STORAGE_KEY_API = 'powerbill_manager_api_key';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Profiles
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load profiles", e);
      return [];
    }
  });

  // Load API Key
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_API) || '';
    } catch (e) {
      return '';
    }
  });

  // Persist Profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save profiles", e);
    }
  }, [profiles]);

  // Persist API Key
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_API, apiKey);
    } catch (e) {
      console.error("Failed to save API key", e);
    }
  }, [apiKey]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
  };

  const addProfile = (name: string, type: ProfileType) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name,
      type,
      items: [],
    };
    setProfiles((prev) => [...prev, newProfile]);
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const addUkscToProfile = (profileId: string, ukscNumbers: string[]) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const newItems: UkscItem[] = ukscNumbers.map((num) => ({
          id: crypto.randomUUID(),
          ukscNumber: num.trim(),
          label: `USKC ${num.trim()}`,
          tenant: {
            name: '',
            flatOrPlotNo: '',
            phone: '',
          },
        }));
        return { ...p, items: [...p.items, ...newItems] };
      })
    );
  };

  const updateUksc = (profileId: string, ukscId: string, updates: Partial<UkscItem>) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        return {
          ...p,
          items: p.items.map((item) => (item.id === ukscId ? { ...item, ...updates } : item)),
        };
      })
    );
  };

  const removeUksc = (profileId: string, ukscId: string) => {
     setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        return {
          ...p,
          items: p.items.filter((item) => item.id !== ukscId),
        };
      })
    );
  }

  const updateTenantDetails = (profileId: string, ukscId: string, details: TenantDetails) => {
    updateUksc(profileId, ukscId, { tenant: details });
  };

  const exportData = () => {
    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      profiles,
      apiKey,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PowerBill_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.profiles && Array.isArray(data.profiles)) {
            setProfiles(data.profiles);
          }
          if (data.apiKey !== undefined) {
             setApiKeyState(data.apiKey || '');
          }
          resolve();
        } catch (error) {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        apiKey,
        addProfile,
        deleteProfile,
        addUkscToProfile,
        updateUksc,
        removeUksc,
        updateTenantDetails,
        setApiKey,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};