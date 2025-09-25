import React, {
  useState
} from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import {
  useNotepadState,
  Tab
} from '../src/state/notepad';
import {
  X
} from 'lucide-react';

const DiffModal: React.FC = () => {
    const {
      tabs,
      isDiffModalOpen,
      closeDiffModal
    } = useNotepadState();
    const [originalTabId, setOriginalTabId] = useState < string | null > (null);
    const [newTabId, setNewTabId] = useState < string | null > (null);

    if (!isDiffModalOpen) {
      return null;
    }

    const originalTab = tabs.find(t => t.id === originalTabId);
    const newTab = tabs.find(t => t.id === newTabId);

    return ( <
      div className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" >
      <
      div className = "bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col" >
      <
      header className = "p-4 border-b border-border flex justify-between items-center" >
      <
      h2 className = "text-lg font-semibold" > Compare Tabs < /h2> <
      button onClick = {
        closeDiffModal
      }
      className = "p-1 rounded-full hover:bg-muted" >
      <
      X className = "h-5 w-5" / >
      <
      /button> <
      /header> <
      div className = "p-4 grid grid-cols-1 md:grid-cols-2 gap-4" >
      <
      div >
      <
      label htmlFor = "original-select"
      className = "block text-sm font-medium text-text-secondary" >
      Original <
      /label> <
      select id = "original-select"
      value = {
        originalTabId || ''
      }
      onChange = {
        (e) => setOriginalTabId(e.target.value)
      }
      className = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background-alt" >
      <
      option value = ""
      disabled > Select a tab < /option> {
        tabs.map(tab => ( <
          option key = {
            tab.id
          }
          value = {
            tab.id
          } > {
            tab.name
          } < /option>
        ))
      } <
      /select> <
      /div> <
      div >
      <
      label htmlFor = "new-select"
      className = "block text-sm font-medium text-text-secondary" >
      New <
      /label> <
      select id = "new-select"
      value = {
        newTabId || ''
      }
      onChange = {
        (e) => setNewTabId(e.target.value)
      }
      className = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background-alt" >
      <
      option value = ""
      disabled > Select a tab < /option> {
        tabs.map(tab => ( <
          option key = {
            tab.id
          }
          value = {
            tab.id
          } > {
            tab.name
          } < /option>
        ))
      } <
      /select> <
      /div> <
      /div> <
      div className = "flex-grow p-4 pt-0 overflow-auto" > {
        originalTab && newTab ? ( <
          ReactDiffViewer oldValue = {
            originalTab.content
          }
          newValue = {
            newTab.content
          }
          splitView = {
            true
          }
          showDiffOnly = {
            false
          }
          useDarkTheme = {
            document.documentElement.classList.contains('dark')
          }
          />
        ) : ( <
          div className = "flex items-center justify-center h-full text-text-secondary" >
          <
          p > Select two tabs to see the differences. < /p> <
          /div>
        )
      } <
      /div> <
      /div> <
      /div>
    );
  };

export default DiffModal;
