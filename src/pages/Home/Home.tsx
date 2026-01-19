import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import {
  Card,
  Text,
  Box,
  Title,
  Spinner,
  Alert,
} from '@nimbus-ds/components';
import { ChevronRightIcon } from '@nimbus-ds/icons';

import { nexo } from '@/app';
import { descriptionAPI } from '@/app/api';

interface Category {
  id: string | number;
  name?: {
    pt?: string;
    es?: string;
    en?: string;
  } | string;
  handle?: {
    pt?: string;
    es?: string;
    en?: string;
  } | string;
  description?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  useTranslation('translations');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await descriptionAPI.getCategories();
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setCategories(response.data.data);
      } else {
        setError('Nenhuma categoria disponível. Certifique-se de que o app está instalado corretamente.');
        setCategories([]);
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Erro ao carregar categorias';
      setError(message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getCategoryName = (category: Category): string => {
    if (typeof category.name === 'string') return category.name;
    if (category.name && typeof category.name === 'object') {
      return category.name.pt || category.name.es || category.name.en || 'Sem nome';
    }
    return 'Sem nome';
  };

  const handleSelectCategory = (categoryId: string | number) => {
    navigate(`/editor/${categoryId}`);
  };

  return (
    <Page maxWidth="900px">
      <Page.Header
        title="Descrições de Categorias"
        subtitle="Selecione uma categoria para editar sua descrição"
      />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
            {error && (
              <Alert appearance="danger" title="Erro">
                {error}
              </Alert>
            )}

            {isLoading && (
              <Box display="flex" justifyContent="center" p="6">
                <Spinner />
              </Box>
            )}

            {!isLoading && categories.length === 0 && (
              <Card>
                <Card.Body>
                  <Box display="flex" flexDirection="column" alignItems="center" gap="4" textAlign="center">
                    <Title as="h3">Nenhuma categoria disponível</Title>
                    <Text color="neutral-textDisabled">
                      Integração com categorias da Nuvemshop em desenvolvimento
                    </Text>
                  </Box>
                </Card.Body>
              </Card>
            )}

            {!isLoading && categories.length > 0 && (
              <Box display="flex" flexDirection="column" gap="2">
                {categories.map((category: Category) => (
                  <Card
                    key={category.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectCategory(category.id)}
                  >
                    <Card.Body>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Title as="h4">{getCategoryName(category)}</Title>
                          <Text as="p" color="neutral-textDisabled" fontSize="caption">
                            ID: {category.id}
                          </Text>
                        </Box>
                        <ChevronRightIcon color="neutral-text" />
                      </Box>
                    </Card.Body>
                  </Card>
                ))}
              </Box>
            )}
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
  );
};

export default Home;
