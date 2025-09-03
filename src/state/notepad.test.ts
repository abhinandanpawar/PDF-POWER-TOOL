import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from 'vitest';
import {
  act,
  renderHook,
  waitFor
} from '@testing-library/react';
import {
  notepadState,
  useNotepadState
} from './notepad';
import {
  loadStateFromDB
} from '../utils/db';

// Mocking dependencies
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
}));

vi.mock('../utils/db', () => ({
  saveStateToDB: vi.fn(),
  loadStateFromDB: vi.fn(),
}));

describe('useNotepadState', () => {
  beforeEach(() => {
    // Reset the state to its initial form before each test
    act(() => {
      notepadState.set({
        tabs: [],
        activeTabId: null,
        isDiffModalOpen: false,
        isInitialized: false,
      });
    });
    vi.clearAllMocks();
  });

  it('should initialize with a default tab if no state is loaded from DB', async () => {
    (loadStateFromDB as vi.Mock).mockResolvedValue(null);
    const {
      result
    } = renderHook(() => useNotepadState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.tabs.length).toBe(1);
    expect(result.current.tabs[0].name).toBe('Untitled-1');
  });

  it('should load state from DB if available', async () => {
    const mockState = {
      tabs: [{
        id: '1',
        name: 'Loaded Tab',
        content: 'Hello DB',
        language: 'javascript'
      }],
      activeTabId: '1',
    };
    (loadStateFromDB as vi.Mock).mockResolvedValue(mockState);
    const {
      result
    } = renderHook(() => useNotepadState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.tabs.length).toBe(1);
    expect(result.current.tabs[0].name).toBe('Loaded Tab');
    expect(result.current.activeTabId).toBe('1');
  });

  it('should add a new tab', async () => {
    (loadStateFromDB as vi.Mock).mockResolvedValue(null);
    const {
      result
    } = renderHook(() => useNotepadState());
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    act(() => {
      result.current.addTab();
    });

    expect(result.current.tabs.length).toBe(2);
    expect(result.current.tabs[1].name).toBe('Untitled-2');
  });

  it('should remove a tab', async () => {
    (loadStateFromDB as vi.Mock).mockResolvedValue(null);
    const {
      result
    } = renderHook(() => useNotepadState());
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    act(() => {
      result.current.addTab(); // 2 tabs total
    });

    const tabToRemoveId = result.current.tabs[1].id;
    act(() => {
      result.current.removeTab(tabToRemoveId);
    });

    expect(result.current.tabs.length).toBe(1);
  });
});
