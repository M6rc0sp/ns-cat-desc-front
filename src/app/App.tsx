import React, { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Box, Text, ToastProvider } from '@nimbus-ds/components';
import { ErrorBoundary, connect, iAmReady } from '@tiendanube/nexo';
import Router from '@/app/Router';
import { AutoRegistrationHandler } from '@/components';

import nexo from './NexoClient';
import NexoSyncRoute from './NexoSyncRoute';
import { DarkModeProvider } from './DarkModeProvider';
import './I18n';

const AppContentInner: React.FC = () => {
  const [isConnect, setIsConnect] = useState(false);
  const location = useLocation();

  // Verificar se está na rota de instalação
  const isInstallRoute = location.pathname === '/ns/install';

  useEffect(() => {
    // Se for a rota de instalação, não aguardar o Nexo
    if (isInstallRoute) {
      setIsConnect(true);
      return;
    }

    // Para outras rotas, aguardar conexão do Nexo
    if (!isConnect) {
      connect(nexo)
        .then(async () => {
          setIsConnect(true);
          iAmReady(nexo);
        })
        .catch(() => {
          setIsConnect(false);
        });
    }
  }, [isConnect, isInstallRoute]);

  if (!isConnect)
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Conectando...</Text>
      </Box>
    );

  // Se for rota de instalação, mostrar Router sem NexoSyncRoute
  if (isInstallRoute) {
    return <Router />;
  }

  return (
    <ErrorBoundary nexo={nexo}>
      <NexoSyncRoute>
        <Router />
      </NexoSyncRoute>
      <AutoRegistrationHandler />
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContentInner />
        </BrowserRouter>
      </ToastProvider>
    </DarkModeProvider>
  );
};

export default App;
