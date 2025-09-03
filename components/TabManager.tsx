import React, { useState } from 'react';
import {
  useNotepadState,
  Tab
} from '../src/state/notepad';
import {
  Plus,
  X,
  GitCompareArrows,
  Wand2
} from 'lucide-react';
import { useToasts } from '../hooks/useToasts';
import PrettierWorker from '../src/workers/prettier.worker?worker';


const TabManager: React.FC = () => {
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    openDiffModal,
    getActiveTab,
    updateTabContent,
    updateTabLanguage,
  } = useNotepadState();
  const { addToast } = useToasts();
  const [isFormatting, setIsFormatting] = useState(false);

  const activeTab = getActiveTab();
  const isFormattable = activeTab && ['javascript', 'css', 'html', 'json'].includes(activeTab.language);

  const handleFormat = () => {
    if (!activeTab || !isFormattable || isFormatting) return;

    setIsFormatting(true);
    const worker = new PrettierWorker();

    worker.onmessage = (event) => {
      if (event.data.error) {
        addToast('error', `Formatting error: ${event.data.error}`);
      } else {
        updateTabContent(activeTab.id, event.data.formattedCode);
        addToast('success', 'Code formatted successfully!');
      }
      setIsFormatting(false);
      worker.terminate();
    };

    worker.onerror = (error) => {
        addToast('error', `Worker error: ${error.message}`);
        setIsFormatting(false);
        worker.terminate();
    };

    worker.postMessage({
      code: activeTab.content,
      language: activeTab.language,
    });
  };

  return (
    <div className="flex items-center border-b border-border bg-background-alt">
      <div className="flex-grow flex items-center overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 border-r border-border text-sm whitespace-nowrap transition-colors ${
              activeTabId === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:bg-muted'
            }`}
          >
            <span>{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
              className="ml-2 p-0.5 rounded-full hover:bg-destructive/80"
            >
              <X className="h-3 w-3" />
            </button>
          </button>
        ))}
      </div>
      <div className="flex items-center">
        {activeTab && (
          <div className="pr-2 border-l border-border">
            <select
              value={activeTab.language}
              onChange={(e) => updateTabLanguage(activeTab.id, e.target.value as Tab['language'])}
              className="bg-transparent text-sm text-text-secondary border-none focus:ring-0"
              aria-label="Select language"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        )}
        <button
          onClick={handleFormat}
          disabled={!isFormattable || isFormatting}
          className="px-3 py-2 text-text-secondary hover:bg-muted border-l border-border disabled:opacity-50 disabled:cursor-not-allowed"
          title={isFormatting ? "Formatting..." : "Format code (Prettier)"}
        >
          <Wand2 className={`h-4 w-4 ${isFormatting ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={openDiffModal}
          className="px-3 py-2 text-text-secondary hover:bg-muted border-l border-border"
          title="Compare tabs"
        >
          <GitCompareArrows className="h-4 w-4" />
        </button>
        <button
          onClick={addTab}
          className="px-3 py-2 text-text-secondary hover:bg-muted border-l border-border"
          title="New tab"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TabManager;
