import React, { useEffect } from 'react';
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
    return html
        .replace(/<h3([^>]*)>/g, '<h2$1>') // H3 → H2
        .replace(/<\/h3>/g, '</h2>')
        .replace(/<h4([^>]*)>/g, '<h3$1>') // H4 → H3
        .replace(/<\/h4>/g, '</h3>');
};

/**
 * Transforma headings: H2→H3, H3→H4
 * Quando recebemos conteúdo de volta, convertemos para o que o editor entende
 */
const transformHeadingsForEditor = (html: string): string => {
    return html
        .replace(/<h2([^>]*)>/g, '<h3$1>') // H2 → H3
        .replace(/<\/h2>/g, '</h3>')
        .replace(/<h1([^>]*)>/g, '<h3$1>') // H1 → H3 (caso venha H1)
        .replace(/<\/h1>/g, '</h3>');
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
                value={transformHeadingsForEditor(value)}
                parser="html"
                onChange={(html: string) => {
                    console.log('RichTextEditor onChange (HTML antes da transformação):', html);
                    const transformed = transformHeadingsForOutput(html);
                    console.log('RichTextEditor onChange (HTML após transformação):', transformed);
                    onChange(transformed);
                }}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
