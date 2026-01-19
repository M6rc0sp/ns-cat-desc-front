import React, { useEffect, useState } from 'react';
import { useAutoRegistration, type AutoRegistrationCredentials } from '@/hooks/useAutoRegistration/useAutoRegistration';
import { autoRegistrationStore } from '@/app/AutoRegistrationStore/AutoRegistrationStore';
import { Box, Button, Modal, Text } from '@nimbus-ds/components';

/**
 * Componente que monitora eventos de auto-registro do backend
 * Exibe modal com credenciais quando usuário é criado automaticamente
 * Após fechar, recarrega a página para que o frontend refaça as requisições
 */
export const AutoRegistrationHandler: React.FC = () => {
  const { credentials, isRegistered, handleAutoRegistration, clearCredentials } = useAutoRegistration();
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);

  useEffect(() => {
    // Subscrever a eventos de auto-registro
    const unsubscribe = autoRegistrationStore.subscribe((event: AutoRegistrationCredentials) => {
      handleAutoRegistration(event);
    });

    return unsubscribe;
  }, [handleAutoRegistration]);

  const handleCopy = (text: string, field: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleModalClose = () => {
    clearCredentials();

    // Recarregar página para que o frontend refaça as requisições
    // Dessa vez, o backend já criou o user, então passará na autenticação
    window.location.reload();
  };

  if (!credentials || !isRegistered) {
    return null;
  }

  return (
    <Modal open={isRegistered} onDismiss={handleModalClose}>
      <Modal.Header>
        <Text fontWeight="bold">Bem-vindo! 🎉</Text>
      </Modal.Header>

      <Modal.Body>
        <Box display="flex" flexDirection="column" gap="3">
          <Text>Sua conta foi criada automaticamente com base no seu email de loja.</Text>

          <Box
            padding="3"
            backgroundColor="neutral-surface"
            borderRadius="1"
            display="flex"
            flexDirection="column"
            gap="2"
          >
            <Box>
              <Text fontWeight="bold" fontSize="caption">
                Email
              </Text>
              <Box display="flex" gap="2" alignItems="center" marginTop="1">
                <Text style={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }} fontSize="caption">
                  {credentials.email}
                </Text>
                <Button
                  onClick={() => handleCopy(credentials.email, 'email')}
                  appearance="neutral"
                  size="small"
                >
                  {copiedField === 'email' ? '✓ Copiado' : 'Copiar'}
                </Button>
              </Box>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="caption">
                Senha
              </Text>
              <Box display="flex" gap="2" alignItems="center" marginTop="1">
                <Text style={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }} fontSize="caption">
                  {credentials.password}
                </Text>
                <Button
                  onClick={() => handleCopy(credentials.password, 'password')}
                  appearance="neutral"
                  size="small"
                >
                  {copiedField === 'password' ? '✓ Copiado' : 'Copiar'}
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            padding="2"
            backgroundColor="warning-surface"
            borderRadius="1"
          >
            <Text color="warning-textLow" fontSize="caption">
              ⚠️ Guarde essas credenciais. Você pode alterá-las depois no seu perfil.
            </Text>
          </Box>
        </Box>
      </Modal.Body>

      <Modal.Footer>
        <Button
          appearance="primary"
          onClick={handleModalClose}
        >
          Entendi! Recarregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
