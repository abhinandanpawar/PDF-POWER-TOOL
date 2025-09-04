import {
  describe,
  it,
  expect,
  vi
} from 'vitest';
import {
  render,
  fireEvent,
  waitFor
} from '@testing-library/react';
import React from 'react';
import PasswordGeneratorView from './PasswordGeneratorView';
import {
  ToastProvider
} from '../hooks/useToasts'; // Assuming ToastProvider is needed for context

// Mock zxcvbn to avoid its overhead in these tests
vi.mock('zxcvbn', () => ({
  default: () => ({
    score: 4,
    feedback: {
      warning: '',
      suggestions: []
    },
    crack_times_display: {
      offline_slow_hashing_1e4_per_second: 'a century'
    },
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render( <
    ToastProvider > {
      ui
    } < /ToastProvider>
  );
};

describe('PasswordGeneratorView', () => {
  it('generates a password with the default settings', async () => {
    const {
      container
    } = renderWithProviders( < PasswordGeneratorView onBack = {
      () => {}
    }
    />);

    await waitFor(() => {
      const passwordDisplay = container.querySelector('.truncate');
      expect(passwordDisplay).not.toBeNull();
      const password = passwordDisplay!.textContent;
      expect(password).not.toBe('');
      expect(password!.length).toBe(16);
      expect(/[a-z]/.test(password!)).toBe(true);
      expect(/[A-Z]/.test(password!)).toBe(true);
      expect(/[0-9]/.test(password!)).toBe(true);
      expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password!)).toBe(false);
    });
  });

  it('changes password length with the slider', async () => {
    const {
      container,
      getByLabelText
    } = renderWithProviders( < PasswordGeneratorView onBack = {
      () => {}
    }
    />);
    const slider = getByLabelText(/Password Length/);

    fireEvent.change(slider, {
      target: {
        value: '32'
      }
    });

    await waitFor(() => {
      const passwordDisplay = container.querySelector('.truncate');
      expect(passwordDisplay!.textContent!.length).toBe(32);
    });
  });

  it('includes symbols when the checkbox is checked', async () => {
    const {
      container,
      getByLabelText
    } = renderWithProviders( < PasswordGeneratorView onBack = {
      () => {}
    }
    />);
    const symbolsCheckbox = getByLabelText(/Include Symbols/);

    fireEvent.click(symbolsCheckbox);

    await waitFor(() => {
      const passwordDisplay = container.querySelector('.truncate');
      const password = passwordDisplay!.textContent;
      expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password!)).toBe(true);
    });
  });

  it('generates a new password when the refresh button is clicked', async () => {
      const { container, getByTitle } = renderWithProviders(<PasswordGeneratorView onBack={() => {}} />);
      let firstPassword = '';

      await waitFor(() => {
          const passwordDisplay = container.querySelector('.truncate');
          expect(passwordDisplay!.textContent).not.toBe('');
          firstPassword = passwordDisplay!.textContent!;
      });

      const refreshButton = getByTitle('Generate new password');
      fireEvent.click(refreshButton);

      await waitFor(() => {
          const passwordDisplay = container.querySelector('.truncate');
          expect(passwordDisplay!.textContent).not.toBe(firstPassword);
      });
  });
});
