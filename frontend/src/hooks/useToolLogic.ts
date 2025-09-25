import { useState } from 'react';
import { useToasts } from './useToasts';
import { useLoading } from './useLoading';

interface ToolLogicOptions<T, R> {
  initialFiles?: File[];
  conversionFunction: (files: File[], options?: T) => Promise<R>;
  successMessage: string;
  errorMessage: string;
  validate?: (files: File[]) => string | null;
}

export const useToolLogic = <T, R>(options: ToolLogicOptions<T, R>) => {
  const [files, setFiles] = useState<File[]>(options.initialFiles || []);
  const [result, setResult] = useState<R | null>(null);
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async (conversionOptions?: T) => {
    if (options.validate) {
      const validationError = options.validate(files);
      if (validationError) {
        addToast('error', validationError);
        return;
      }
    }

    if (files.length === 0) {
      addToast('error', 'Please select files to process.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await options.conversionFunction(files, conversionOptions);
      setFiles([]);
      setResult(res);
      addToast('success', options.successMessage);
    } catch (e) {
      addToast('error', options.errorMessage + ': ' + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { files, setFiles, handleProcess, result, isLoading };
};
