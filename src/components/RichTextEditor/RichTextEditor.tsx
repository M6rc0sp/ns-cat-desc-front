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
 * Componente RichTextEditor - Wrapper do Nimbus DS Editor
 * Usa parser="html" para entrada e saída em HTML
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
                value={value}
                parser="html"
                onChange={(html: string) => {
                    console.log('RichTextEditor onChange (HTML):', html);
                    onChange(html);
                }}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
