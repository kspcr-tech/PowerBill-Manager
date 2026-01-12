import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Profile, ProfileType, UkscItem, TenantDetails } from '../types';

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = 'powerbill_manager_data_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

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

  return (
    <AppContext.Provider
      value={{
        profiles,
        addProfile,
        deleteProfile,
        addUkscToProfile,
        updateUksc,
        removeUksc,
        updateTenantDetails,
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