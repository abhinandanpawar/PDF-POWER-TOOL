import React, { useRef, useEffect, useState } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, historyKeymap, foldKeymap, indentWithTab } from '@codemirror/commands';
import { history } from '@codemirror/commands';
import { foldGutter, indentOnInput, bracketMatching } from '@codemirror/language';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { search, searchKeymap } from '@codemirror/search';
import { secretScannerPlugin } from '../editor-extensions/secret-scanner';

// Language Support
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { Tab } from '../src/state/notepad';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Tab['language'];
}

const languageCompartment = new Compartment();

const getLanguageExtension = (language: Tab['language']) => {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    case 'markdown':
      return markdown();
    default:
      return javascript();
  }
}

const Editor: React.FC<EditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          search({ top: true }),
          secretScannerPlugin,
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...searchKeymap,
            indentWithTab,
          ]),
          oneDark,
          languageCompartment.of(getLanguageExtension(language)),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      viewRef.current = view;
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []); // Remove onChange from deps to prevent re-creation

  // Handle language changes
  useEffect(() => {
    if (viewRef.current) {
        viewRef.current.dispatch({
            effects: languageCompartment.reconfigure(getLanguageExtension(language))
        })
    }
  }, [language]);

  // Handle value changes from parent
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);

  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (language === 'markdown') {
      const dirtyHtml = marked.parse(value) as string;
      setPreviewHtml(DOMPurify.sanitize(dirtyHtml));
    }
  }, [value, language]);

  if (language === 'markdown') {
    return (
      <div className="flex h-full w-full">
        <div ref={editorRef} className="h-full w-1/2" />
        <div
          className="h-full w-1/2 p-4 overflow-auto border-l border-border prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    );
  }

  return <div ref={editorRef} className="h-full w-full" />;
};

export default Editor;
