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

        const loadCategoryFromNuvemshop = async () => {
            try {
                setIsLoading(true);

                // Carrega a categoria diretamente da Nuvemshop (via nosso backend)
                const response = await descriptionAPI.getByCategory(categoryId);

                if (response.data.success && response.data.data) {
                    const categoryData = response.data.data;

                    // Extrai o nome da categoria
                    let name = '';
                    if (categoryData.name) {
                        if (typeof categoryData.name === 'string') {
                            name = categoryData.name;
                        } else {
                            name = categoryData.name.pt || categoryData.name.es || categoryData.name.en || '';
                        }
                    }
                    setCategoryName(name);

                    // Extrai a descrição existente
                    const htmlContent = categoryData.html_content || '';

                    setDescription({
                        id: categoryData.id?.toString(),
                        category_id: categoryId,
                        content: categoryData.content || '',
                        html_content: htmlContent,
                        name: typeof categoryData.name === 'object' ? categoryData.name : { pt: name },
                    });
                }
            } catch (error: any) {
                console.error('Erro ao carregar categoria da Nuvemshop:', error);
                // Se for 404, a categoria pode não existir ou não ter descrição
                if (error.response?.status !== 404) {
                    setMessage('Erro ao carregar dados da categoria');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadCategoryFromNuvemshop();
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

            // Sempre usa update pois estamos atualizando a categoria na Nuvemshop
            // O categoryId é o ID da categoria na Nuvemshop
            await descriptionAPI.update(categoryId, {
                content: plainContent,
                html_content: plainContent,
            });

            setMessage('Descrição sincronizada com a Nuvemshop com sucesso!');

            setTimeout(() => setMessage(''), 3000);
        } catch (error: unknown) {
            console.error('Erro ao salvar:', error);
            const resp = (error as { response?: { data?: { message?: string } } })?.response;
            const errorMessage = resp?.data?.message || (error as Error)?.message || 'Erro ao salvar a descrição';
            setMessage(errorMessage);
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
