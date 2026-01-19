import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Text, Spinner, Card, Button } from '@nimbus-ds/components';
// Importar o axios diretamente, não o do app que tem configuração do Nexo
import axiosStandard from 'axios';

// URL da API (sem barra no final para evitar duplicação)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const InstallPage: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('Processando instalação...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleInstall = async () => {
            try {
                // Extrair o código da query string
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');

                if (code) {
                    console.log('Iniciando instalação com código:', code);
                    setStatus('loading');
                    setMessage('Conectando ao servidor de instalação...');

                    // Fazer a chamada para o endpoint da API
                    const response = await axiosStandard.get(`${API_URL}/ns/install?code=${code}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('Instalação finalizada:', response);

                    if (response.data && response.data.success) {
                        setStatus('success');
                        setMessage('Instalação concluída com sucesso! Redirecionando para a loja...');

                        // Redirecionar para a loja após a instalação
                        setTimeout(() => {
                            window.location.href = 'https://www.nuvemshop.com.br/login';
                        }, 2000);
                    } else {
                        setStatus('error');
                        setMessage(`Erro: ${response.data?.message || 'Falha na instalação'}`);
                    }
                } else {
                    console.error('Código de instalação não encontrado');
                    setStatus('error');
                    setMessage('Erro: Código de instalação não encontrado');
                }
            } catch (error: any) {
                console.error('Erro durante o processo de instalação:', error);
                setStatus('error');
                setMessage(`Erro durante instalação: ${error.message || 'Falha na conexão'}`);
            }
        };

        handleInstall();
    }, [location, navigate]);

    return (
        <Box
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="4"
            backgroundColor="primary-surface"
        >
            <Card padding="small">
                <Box marginBottom="4">
                    <Text fontWeight="bold">Instalação do Aplicativo</Text>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="4"
                    padding="4"
                >
                    {status === 'loading' && <Spinner size="medium" />}

                    <Text
                        textAlign="center"
                        fontWeight={status === 'error' ? 'bold' : 'regular'}
                        color={
                            status === 'error'
                                ? 'danger-textHigh'
                                : status === 'success'
                                    ? 'success-textHigh'
                                    : 'neutral-textHigh'
                        }
                    >
                        {message}
                    </Text>
                </Box>
                {status === 'error' && (
                    <Box display="flex" gap="2" justifyContent="flex-end" padding="4">
                        <Button
                            appearance="primary"
                            onClick={() => navigate('/')}
                        >
                            Voltar ao App
                        </Button>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default InstallPage;
