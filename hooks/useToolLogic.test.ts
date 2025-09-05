import { renderHook, act } from '@testing-library/react';
import { useToolLogic } from './useToolLogic';
import { useToasts } from './useToasts';
import { useLoading } from './useLoading';
import { vi } from 'vitest';

// Mock the useToasts and useLoading hooks
vi.mock('./useToasts', () => ({
  useToasts: vi.fn(),
}));

vi.mock('./useLoading', () => ({
  useLoading: vi.fn(),
}));

describe('useToolLogic', () => {
  const mockConversionFunction = vi.fn((files: File[], options?: any) => Promise.resolve('success'));
  let mockAddToast: ReturnType<typeof useToasts>['addToast'];
  let mockShowLoading: ReturnType<typeof useLoading>['showLoading'];
  let mockHideLoading: ReturnType<typeof useLoading>['hideLoading'];

  beforeEach(() => {
    mockConversionFunction.mockClear();

    // Get the mocked functions inside beforeEach
    vi.mocked(useToasts).mockReturnValue({
      addToast: vi.fn(),
    });
    vi.mocked(useLoading).mockReturnValue({
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    mockAddToast = useToasts().addToast;
    mockShowLoading = useLoading().showLoading;
    mockHideLoading = useLoading().hideLoading;
  });

  it('should initialize with empty files array if no initialFiles are provided', () => {
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));
    expect(result.current.files).toEqual([]);
  });

  it('should initialize with provided initialFiles', () => {
    const initialFiles = [new File(['content'], 'test.pdf')];
    const { result } = renderHook(() => useToolLogic({
      initialFiles,
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));
    expect(result.current.files).toEqual(initialFiles);
  });

  it('should call conversionFunction and show success toast on successful process', async () => {
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));

    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    await act(async () => {
      await result.current.handleProcess();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockConversionFunction).toHaveBeenCalledWith([file], undefined);
    expect(mockAddToast).toHaveBeenCalledWith('success', 'Success');
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(result.current.files).toEqual([]); // Files should be cleared
  });

  it('should show error toast on failed process', async () => {
    mockConversionFunction.mockRejectedValueOnce(new Error('Conversion failed'));

    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));

    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    await act(async () => {
      await result.current.handleProcess();
    });

    expect(mockShowLoading).toHaveBeenCalledTimes(1);
    expect(mockConversionFunction).toHaveBeenCalledWith([file], undefined);
    expect(mockAddToast).toHaveBeenCalledWith('error', 'Error: Conversion failed');
    expect(mockHideLoading).toHaveBeenCalledTimes(1);
    expect(result.current.files).toEqual([file]); // Files should not be cleared on error
  });

  it('should call validate function and show error if validation fails', async () => {
    const mockValidate = vi.fn((files: File[]) => files.length === 0 ? 'No files' : null);

    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
      validate: mockValidate,
    }));

    await act(async () => {
      await result.current.handleProcess();
    });

    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockAddToast).toHaveBeenCalledWith('error', 'No files');
    expect(mockShowLoading).not.toHaveBeenCalled();
    expect(mockConversionFunction).not.toHaveBeenCalled();
  });

  it('should pass options to conversion function', async () => {
    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));

    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    const options = { format: 'pdf' };
    await act(async () => {
      await result.current.handleProcess(options);
    });

    expect(mockConversionFunction).toHaveBeenCalledWith([file], options);
  });

  it('should return result from conversion function', async () => {
    mockConversionFunction.mockResolvedValueOnce('converted_text');

    const { result } = renderHook(() => useToolLogic({
      conversionFunction: mockConversionFunction,
      successMessage: 'Success',
      errorMessage: 'Error',
    }));

    const file = new File(['content'], 'test.pdf');
    act(() => {
      result.current.setFiles([file]);
    });

    await act(async () => {
      await result.current.handleProcess();
    });

    expect(result.current.result).toBe('converted_text');
  });
});
