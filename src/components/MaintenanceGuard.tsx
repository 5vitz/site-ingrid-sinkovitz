import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SiteSettings } from '../types';
import { MaintenanceMode } from './MaintenanceMode';

interface MaintenanceGuardProps {
  children: React.ReactNode;
  settings: SiteSettings | null;
}

export const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children, settings }) => {
  const { role, loading } = useAuth();
  const isAdmin = ['super', 'admin'].includes(role || '');

  const [bypassed, setBypassed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('maintenance_bypassed') === 'true';
  });

  const handleBypass = () => {
    setBypassed(true);
    localStorage.setItem('maintenance_bypassed', 'true');
  };

  // CONECTADO ÀS CONFIGURAÇÕES DO BANCO DE DADOS
  const isMaintenanceActive = settings?.maintenanceMode === true;

  if (loading) {
    return <MaintenanceMode title={settings?.maintenanceTitle} isLoading={true} />;
  }

  if (isMaintenanceActive && !bypassed) {
    if (!isAdmin) {
      return <MaintenanceMode title={settings?.maintenanceTitle} />;
    }
    
    return (
      <MaintenanceMode 
        title={settings?.maintenanceTitle} 
        isAdmin={true} 
        onBypass={handleBypass}
      />
    );
  }

  return <>{children}</>;
};
