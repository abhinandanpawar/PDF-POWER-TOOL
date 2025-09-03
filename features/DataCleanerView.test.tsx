import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataCleanerView from './DataCleanerView';
import React from 'react';

describe('DataCleanerView', () => {
  it('renders correctly', () => {
    render(<DataCleanerView onBack={() => {}} />);
    expect(screen.getByText('Data Cleaner')).toBeInTheDocument();
    expect(screen.getByText('Clean and transform your text data.')).toBeInTheDocument();
    expect(screen.getByLabelText('Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Output')).toBeInTheDocument();
  });

  it('trims leading/trailing whitespace', () => {
    render(<DataCleanerView onBack={() => {}} />);
    const input = screen.getByLabelText('Input');
    const output = screen.getByLabelText('Output');
    const trimButton = screen.getByRole('button', { name: 'Trim Lines' });

    fireEvent.change(input, { target: { value: '  line1  \n  line2  ' } });
    fireEvent.click(trimButton);

    expect(output).toHaveValue('line1\nline2');
  });
});
