import { useState, useCallback } from 'react';

export interface AutoRegistrationCredentials {
  email: string;
  password: string;
  name: string;
}

export interface UseAutoRegistrationReturn {
  credentials: AutoRegistrationCredentials | null;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  handleAutoRegistration: (credentials: AutoRegistrationCredentials) => void;
  clearCredentials: () => void;
}

/**
 * Hook para gerenciar auto-registro quando backend retorna 402
 * Captura credenciais e marca como registrado para auto-login
 */
export function useAutoRegistration(): UseAutoRegistrationReturn {
  const [credentials, setCredentials] = useState<AutoRegistrationCredentials | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleAutoRegistration = useCallback((creds: AutoRegistrationCredentials) => {
    setCredentials(creds);
    setIsRegistered(true);
  }, []);

  const clearCredentials = useCallback(() => {
    setCredentials(null);
    setIsRegistered(false);
  }, []);

  return {
    credentials,
    isRegistered,
    setIsRegistered,
    handleAutoRegistration,
    clearCredentials,
  };
}
