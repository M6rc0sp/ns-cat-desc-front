import React, { useEffect, useMemo } from 'react';
import { Editor } from '@nimbus-ds/editor';
import './RichTextEditor.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
}

/**
 * Transforma headings: H3→H2, H4→H3
 * O editor Nimbus só suporta H3 e H4, mas queremos salvar como H2 e H3
 */
const transformHeadingsForOutput = (html: string): string => {
    const result = html
        .replace(/<h3([^>]*)>/gi, '<h2$1>')
        .replace(/<\/h3>/gi, '</h2>')
        .replace(/<h4([^>]*)>/gi, '<h3$1>')
        .replace(/<\/h4>/gi, '</h3>');
    
    if (result !== html) {
        console.log('✅ [transformHeadingsForOutput] H3→H2, H4→H3');
        console.log('   Antes: ', html.substring(0, 80));
        console.log('   Depois:', result.substring(0, 80));
    }
    return result;
};

/**
 * Transforma headings: H2→H3, H1→H3
 * Quando recebemos conteúdo H2, convertemos para H3 para o editor entender
 */
const transformHeadingsForEditor = (html: string): string => {
    const result = html
        .replace(/<h2([^>]*)>/gi, '<h3$1>')
        .replace(/<\/h2>/gi, '</h3>')
        .replace(/<h1([^>]*)>/gi, '<h3$1>')
        .replace(/<\/h1>/gi, '</h3>');
    
    if (result !== html) {
        console.log('✅ [transformHeadingsForEditor] H2→H3, H1→H3');
        console.log('   Antes: ', html.substring(0, 80));
        console.log('   Depois:', result.substring(0, 80));
    }
    return result;
};

/**
 * Componente RichTextEditor - Wrapper do Nimbus DS Editor
 * Usa parser="html" para entrada e saída em HTML
 * Transforma automaticamente H3→H2 e H4→H3
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Digite aqui...',
    minHeight = '300px',
}) => {
    // Transforma o value que vem do componente pai (H2/H1) para H3/H4 que o editor entende
    const transformedValue = useMemo(() => {
        return transformHeadingsForEditor(value);
    }, [value]);

    // Listener no document em fase de CAPTURE — dispara antes do editor interceptar
    useEffect(() => {
        const handlePasteCapture = (e: ClipboardEvent) => {
            const clipboardData = e.clipboardData;
            if (!clipboardData) return;

            const types = Array.from(clipboardData.types);

            console.group('🔍 [DEBUG CLIPBOARD - capture phase]');
            console.log('Tipos disponíveis:', types);

            types.forEach((type) => {
                const data = clipboardData.getData(type);
                console.group(`📋 "${type}"`);
                console.log(data || '(vazio)');
                console.groupEnd();
            });

            if (clipboardData.items.length > 0) {
                console.group('📦 Items:');
                Array.from(clipboardData.items).forEach((item, i) => {
                    console.log(`[${i}] kind="${item.kind}", type="${item.type}"`);
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        console.log(`  → ${file?.name} (${file?.size} bytes)`);
                    }
                });
                console.groupEnd();
            }

            console.groupEnd();
        };

        // true = capture phase, dispara antes de qualquer handler do editor
        document.addEventListener('paste', handlePasteCapture, true);
        return () => {
            document.removeEventListener('paste', handlePasteCapture, true);
        };
    }, []);

    return (
        <div
            className="rich-text-editor"
            style={{
                minHeight,
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        >
            <Editor
                value={transformedValue}
                parser="html"
                onChange={(html: string) => {
                    // Transforma H3→H2, H4→H3 antes de passar pro componente pai
                    const transformed = transformHeadingsForOutput(html);
                    onChange(transformed);
                }}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
