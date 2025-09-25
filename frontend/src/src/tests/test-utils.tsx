import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../hooks/useToasts';

const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <MemoryRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
