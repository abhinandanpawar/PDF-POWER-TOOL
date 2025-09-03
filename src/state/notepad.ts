import {
  hookstate,
  useHookstate,
  none
} from '@hookstate/core';
import {
  v4 as uuidv4
} from 'uuid';
import {
  saveStateToDB,
  loadStateFromDB
} from '../utils/db';
import {
  useEffect
} from 'react';

export interface Tab {
  id: string;
  name: string;
  content: string;
  language: 'javascript' | 'html' | 'css' | 'json' | 'markdown';
}

export interface NotepadState {
  tabs: Tab[];
  activeTabId: string | null;
  isDiffModalOpen: boolean;
  isInitialized: boolean;
}

const initialState: NotepadState = {
  tabs: [],
  activeTabId: null,
  isDiffModalOpen: false,
  isInitialized: false,
};

export const notepadState = hookstate(initialState);

// --- State Initialization ---
let initStatePromise: Promise < void > | null = null;
const initializeState = async () => {
  if (notepadState.isInitialized.get()) return;
  if (initStatePromise) return initStatePromise;

  initStatePromise = (async () => {
    const loadedState = await loadStateFromDB();
    if (loadedState && loadedState.tabs.length > 0) {
      notepadState.set(s => ({ ...s,
        ...loadedState,
        isInitialized: true
      }));
    } else {
      // If no state, create a default tab
      const newTab: Tab = {
        id: uuidv4(),
        name: 'Untitled-1',
        content: '// Welcome to your offline notepad!',
        language: 'javascript',
      };
      notepadState.set(s => ({ ...s,
        tabs: [newTab],
        activeTabId: newTab.id,
        isInitialized: true
      }));
    }
  })();
  await initStatePromise;
  initStatePromise = null;
};


export const useNotepadState = () => {
  const state = useHookstate(notepadState);

  // --- Effects ---
  // Initialize state from DB on first use
  useEffect(() => {
    initializeState();
  }, []);

  // Autosave state to DB on change (debounced)
  useEffect(() => {
    if (!state.isInitialized.get()) return;

    const handler = setTimeout(() => {
      saveStateToDB({
        tabs: state.tabs.get(),
        activeTabId: state.activeTabId.get(),
      });
    }, 1000); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [state.tabs, state.activeTabId, state.isInitialized]);


  // --- Actions ---
  const addTab = () => {
    const newTab: Tab = {
      id: uuidv4(),
      name: `Untitled-${state.tabs.get().length + 1}`,
      content: '',
      language: 'javascript',
    };
    state.tabs.merge([newTab]);
    state.activeTabId.set(newTab.id);
  };

  const removeTab = (tabId: string) => {
    const currentState = state.get();
    const tabIndex = currentState.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = currentState.tabs.filter(t => t.id !== tabId);
    let newActiveTabId = currentState.activeTabId;

    if (currentState.activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        newActiveTabId = newTabs[newActiveIndex].id;
      } else {
        newActiveTabId = null;
      }
    }

    state.set(s => ({
        ...s,
        tabs: newTabs,
        activeTabId: newActiveTabId,
    }));
  };

  const setActiveTab = (tabId: string) => {
    state.activeTabId.set(tabId);
  };

  const updateTabContent = (tabId: string, content: string) => {
    const tabIndex = state.tabs.get().findIndex(t => t.id === tabId);
    if (tabIndex !== -1) {
      state.tabs[tabIndex].content.set(content);
    }
  };

  const updateTabLanguage = (tabId: string, language: Tab['language']) => {
    const tabIndex = state.tabs.get().findIndex(t => t.id === tabId);
    if (tabIndex !== -1) {
      state.tabs[tabIndex].language.set(language);
    }
  };

  const getActiveTab = (): Tab | undefined => {
    const activeId = state.activeTabId.get();
    if (!activeId) return undefined;
    return state.tabs.get().find(t => t.id === activeId);
  };

  const openDiffModal = () => {
    state.isDiffModalOpen.set(true);
  };

  const closeDiffModal = () => {
    state.isDiffModalOpen.set(false);
  };

  return {
    state: state,
    addTab,
    removeTab,
    setActiveTab,
    updateTabContent,
    getActiveTab,
    openDiffModal,
    closeDiffModal,
    updateTabLanguage,
    tabs: state.tabs.get(),
    activeTabId: state.activeTabId.get(),
    isDiffModalOpen: state.isDiffModalOpen.get(),
    isInitialized: state.isInitialized.get(),
  };
};
