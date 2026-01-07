"use client"
import React, { createContext, useState } from 'react';

interface MeuContextoType {
  bloqueioMenu: boolean;
  setBloqueioMenu: (value: boolean) => void;
}

export const MeuContexto = createContext<MeuContextoType | undefined>(undefined);

export const MeuProvider = ({ children }: { children: React.ReactNode }) => {
  const [bloqueioMenu, setBloqueioMenu] = useState(false);

  return (
    <MeuContexto.Provider value={{ bloqueioMenu, setBloqueioMenu }}>
      {children}
    </MeuContexto.Provider>
  );
};