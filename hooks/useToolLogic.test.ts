import { renderHook, act } from '@testing-library/react';
import { useToolLogic } from './useToolLogic';
import { useToasts } from './useToasts';
import { vi } from 'vitest';

// Mock the useToasts hook
vi.mock('./useToasts', () => ({
  useToasts: vi.fn(),
}));

describe('useToolLogic', () => {
  const mockConversionFunction = vi.fn();
  const mockAddToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToasts).mockReturnValue({ addToast: mockAddToast });
  });

  it('should initialize with empty files array', () => {
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));
    expect(result.current.files).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set files', () => {
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));
    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });
    expect(result.current.files).toEqual([file]);
  });

  it('should handle successful process', async () => {
    mockConversionFunction.mockResolvedValue('success_result');
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success!',
      errorMessage: 'Error!',
    }));
    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    const processPromise = act(() => result.current.handleProcess());

    // This is tricky; we can't easily test the intermediate loading state with react-testing-library's renderHook
    // But we can check the final states
    await processPromise;

    expect(mockConversionFunction).toHaveBeenCalledWith([file], undefined);
    expect(mockAddToast).toHaveBeenCalledWith('success', 'Success!');
    expect(result.current.result).toBe('success_result');
    expect(result.current.files).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle failed process', async () => {
    const error = new Error('Conversion failed');
    mockConversionFunction.mockRejectedValue(error);
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success!',
      errorMessage: 'Error!',
    }));
    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    await act(() => result.current.handleProcess());

    expect(mockConversionFunction).toHaveBeenCalledWith([file], undefined);
    expect(mockAddToast).toHaveBeenCalledWith('error', 'Error!: ' + error.message);
    expect(result.current.result).toBeNull();
    expect(result.current.files).toEqual([file]); // Files should not be cleared
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle validation failure', async () => {
    const mockValidate = vi.fn(() => 'Validation Error');
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success!',
      errorMessage: 'Error!',
      validate: mockValidate,
    }));

    await act(() => result.current.handleProcess());

    expect(mockValidate).toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalledWith('error', 'Validation Error');
    expect(mockConversionFunction).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
