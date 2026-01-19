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
