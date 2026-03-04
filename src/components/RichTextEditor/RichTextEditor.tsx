import React from 'react';
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
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = e.clipboardData;
        const types = Array.from(clipboardData.types);

        console.group('🔍 [DEBUG CLIPBOARD] Evento de paste capturado');
        console.log('Tipos disponíveis no clipboard:', types);

        types.forEach((type) => {
            const data = clipboardData.getData(type);
            console.group(`📋 Tipo: "${type}"`);
            console.log(data || '(vazio)');
            console.groupEnd();
        });

        // Verifica itens (para imagens ou arquivos)
        if (clipboardData.items.length > 0) {
            console.group('📦 Items no clipboard:');
            Array.from(clipboardData.items).forEach((item, i) => {
                console.log(`Item [${i}]: kind="${item.kind}", type="${item.type}"`);
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    console.log(`  → Arquivo: ${file?.name} (${file?.size} bytes)`);
                }
            });
            console.groupEnd();
        }

        console.groupEnd();
    };

    return (
        <div
            className="rich-text-editor"
            style={{
                minHeight,
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
            onPaste={handlePaste}
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
