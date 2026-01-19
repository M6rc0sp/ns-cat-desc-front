import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, Spinner, Text, Input } from '@nimbus-ds/components';
import { RichTextEditor } from '@/components/RichTextEditor';
import { descriptionAPI } from '@/app/api';
import styles from './Editor.module.css';

interface CategoryDescription {
    id?: string;
    category_id: string;
    content: string;
    html_content: string;
    name?: {
        pt?: string;
        es?: string;
        en?: string;
    };
}

interface Category {
    id: string | number;
    name?: {
        pt?: string;
        es?: string;
        en?: string;
    };
    description?: {
        pt?: string;
        es?: string;
        en?: string;
    };
}

export const EditorPage: React.FC = () => {
    const { categoryId: paramCategoryId } = useParams<{ categoryId?: string }>();
    const categoryId = paramCategoryId || '';

    const [description, setDescription] = useState<CategoryDescription>({
        category_id: categoryId,
        content: '',
        html_content: '',
        name: {
            pt: '',
            es: '',
            en: '',
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        if (!categoryId) return;

        const loadDescription = async () => {
            try {
                setIsLoading(true);

                // Primeiro tenta carregar a descrição local
                try {
                    const response = await descriptionAPI.getByCategory(categoryId);
                    if (response.data.success) {
                        setDescription(response.data.data);
                    }
                } catch (error: any) {
                    if (error.response?.status !== 404) {
                        throw error;
                    }
                    // 404 é normal quando a categoria ainda não tem descrição
                }

                // Depois tenta carregar as categorias da Nuvemshop para pegar o nome
                try {
                    const categoriesResponse = await descriptionAPI.getCategories();
                    if (categoriesResponse.data.success && Array.isArray(categoriesResponse.data.data)) {
                        const category = categoriesResponse.data.data.find(
                            (cat: Category) => cat.id.toString() === categoryId.toString()
                        );

                        if (category && category.name) {
                            setCategoryName(
                                category.name.pt || category.name.es || category.name.en || ''
                            );
                            setDescription(prev => ({
                                ...prev,
                                name: category.name,
                            }));
                        }
                    }
                } catch (error: any) {
                    console.warn('Não foi possível carregar categorias da Nuvemshop:', error);
                }
            } catch (error: any) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDescription();
    }, [categoryId]);

    const handleSave = async () => {
        if (!categoryId) {
            setMessage('Category ID não encontrado');
            return;
        }

        try {
            setIsSaving(true);
            setMessage('');

            const plainContent = description.html_content.trim();

            console.log('handleSave - plainContent:', plainContent);
            console.log('handleSave - categoryName:', categoryName);

            if (!plainContent) {
                setMessage('A descrição não pode estar vazia');
                setIsSaving(false);
                return;
            }

            if (description.id) {
                // Update
                await descriptionAPI.update(description.id, {
                    content: plainContent,
                    html_content: plainContent,
                });
                setMessage('Descrição atualizada com sucesso!');
            } else {
                // Create
                await descriptionAPI.create({
                    category_id: categoryId,
                    content: plainContent,
                    html_content: plainContent,
                });
                setMessage('Descrição criada com sucesso!');
            }

            setTimeout(() => setMessage(''), 3000);
        } catch (error: unknown) {
            console.error('Erro ao salvar:', error);
            const resp = (error as { response?: { data?: { message?: string } } })?.response;
            const message = resp?.data?.message || (error as Error)?.message || 'Erro ao salvar a descrição';
            setMessage(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box padding="4" className={styles.container}>
            <Card padding="base">
                <Box marginBottom="4">
                    <Text fontSize="highlight" fontWeight="bold">
                        {categoryId ? 'Editar Descrição da Categoria' : 'Nova Descrição'}
                    </Text>
                    {categoryId && (
                        <Text fontSize="caption" color="neutral-textLow">
                            Categoria ID: {categoryId}
                        </Text>
                    )}
                </Box>

                {!categoryId ? (
                    <Box
                        padding="4"
                        backgroundColor="warning-surface"
                        borderRadius="base"
                    >
                        <Text color="warning-textHigh" fontWeight="bold">
                            ⚠️ Selecione uma categoria
                        </Text>
                        <Box marginTop="2">
                            <Text color="warning-textHigh" fontSize="caption">
                                Para criar ou editar uma descrição, acesse através da lista de categorias.
                            </Text>
                        </Box>
                        <Box marginTop="4">
                            <Button appearance="neutral" onClick={() => window.history.back()}>
                                ← Voltar
                            </Button>
                        </Box>
                    </Box>
                ) : isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <Spinner size="small" />
                    </Box>
                ) : (
                    <>
                        {categoryName && (
                            <Box marginBottom="4">
                                <Box marginBottom="2">
                                    <Text fontWeight="bold">
                                        Nome da Categoria
                                    </Text>
                                </Box>
                                <Input
                                    disabled
                                    value={categoryName}
                                    placeholder="Nome da categoria"
                                />
                            </Box>
                        )}

                        <Box marginBottom="4">
                            <Box marginBottom="2">
                                <Text fontWeight="bold">
                                    Descrição da Categoria
                                </Text>
                            </Box>
                            <RichTextEditor
                                value={description.html_content}
                                onChange={(content) => {
                                    console.log('RichTextEditor onChange:', content);
                                    setDescription(prev => ({
                                        ...prev,
                                        html_content: content,
                                    }));
                                }}
                                placeholder="Digite a descrição da categoria aqui..."
                                minHeight="300px"
                            />
                        </Box>

                        <Box
                            display="flex"
                            gap="2"
                            justifyContent="flex-end"
                            marginTop="4"
                        >
                            <Button
                                appearance="neutral"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? <Spinner size="small" /> : 'Salvar'}
                            </Button>
                        </Box>

                        {message && (
                            <Box
                                marginTop="3"
                                padding="3"
                                backgroundColor={message.includes('sucesso') ? 'success-surface' : 'danger-surface'}
                                borderRadius="base"
                            >
                                <Text
                                    color={message.includes('sucesso') ? 'success-textHigh' : 'danger-textHigh'}
                                >
                                    {message}
                                </Text>
                            </Box>
                        )}
                    </>
                )}
            </Card>
        </Box>
    );
};

export default EditorPage;
