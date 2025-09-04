import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import Editor from '../components/Editor';
import TabManager from '../components/TabManager';
import DiffModal from '../components/DiffModal';
import { useNotepadState } from '../src/state/notepad';

interface NotepadViewProps {
  onBack: () => void;
}

const NotepadView: React.FC<NotepadViewProps> = ({ onBack }) => {
  const { getActiveTab, updateTabContent, isInitialized } = useNotepadState();
  const activeTab = getActiveTab();

  const handleEditorChange = (content: string) => {
    if (activeTab) {
      updateTabContent(activeTab.id, content);
    }
  };

  return (
    <ToolPageLayout
      title="Offline Notepad"
      onBack={onBack}
      description="A multi-tab, offline-first code editor with syntax highlighting, auto-saving, and more."
      fullWidth={true}
    >
      <div className="flex flex-col h-[calc(100vh-250px)] border border-border rounded-lg">
        {!isInitialized ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p>Loading session...</p>
          </div>
        ) : (
          <>
            <TabManager />
            <div className="flex-grow h-full">
              {activeTab ? (
                <Editor
                  key={activeTab.id} // Re-mount editor when tab changes
                  value={activeTab.content}
                  onChange={handleEditorChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                  <p>Create a new tab to start writing.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <DiffModal />
    </ToolPageLayout>
  );
};

export default NotepadView;
